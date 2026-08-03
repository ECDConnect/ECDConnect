import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import {
  getChildProgressReports,
  getChildProgressReportsForPractitioner,
  getPractitionerProgressReportSummary,
  getProgressTrackingAgeGroups,
  getProgressTrackingContent,
  getResourceLinks,
  syncChildProgressReports,
} from './progress-tracking.actions';
import { ProgressTrackingState } from './progress-tracking.types';
import { newGuid } from '@/utils/common/uuid.utils';
import { ProgressSkillValues } from '@/enums/ProgressSkillValues';
import {
  addChildProgressReportPeriods,
  upsertChildProgressReportPeriods,
} from '../classroom/classroom.actions';

type PeriodPairing = { id: string; startDate: string | Date };

/**
 * When reporting periods are created/synced, the server returns the authoritative
 * set. If another device created the periods first, the ids we submitted differ from
 * the winning ids. Any reports already authored locally against our (now defunct)
 * period ids must be repointed to the winning ids and re-synced — otherwise they
 * would sync against a period that does not exist server-side and would escape the
 * report-level duplicate guard (which keys on childProgressReportPeriodId).
 *
 * Mutates the given reports in place (Immer draft); no-op when nothing changed.
 */
function remapReportsToServerPeriods<
  R extends { childProgressReportPeriodId: string; synced?: boolean }
>(
  reports: R[],
  localPeriods: PeriodPairing[],
  serverPeriods: PeriodPairing[]
): void {
  if (!serverPeriods?.length || !localPeriods?.length) {
    return;
  }

  const startKey = (d: string | Date) => new Date(d).toISOString().slice(0, 10);

  // Primary pairing: same start date. Fallback: positional pairing once both sets
  // are ordered by start date (used when start dates differ slightly between devices
  // but the term sets line up one-to-one).
  const serverByStart = new Map<string, string>();
  serverPeriods.forEach((p) => serverByStart.set(startKey(p.startDate), p.id));

  const sortByStart = (list: PeriodPairing[]) =>
    [...list].sort(
      (a, b) =>
        new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );
  const sortedLocal = sortByStart(localPeriods);
  const sortedServer = sortByStart(serverPeriods);
  const sameCount = sortedLocal.length === sortedServer.length;

  const idMap = new Map<string, string>();
  localPeriods.forEach((local) => {
    let serverId = serverByStart.get(startKey(local.startDate));
    if (!serverId && sameCount) {
      const idx = sortedLocal.findIndex((x) => x.id === local.id);
      serverId = sortedServer[idx]?.id;
    }
    if (serverId && serverId !== local.id) {
      idMap.set(local.id, serverId);
    }
  });

  if (idMap.size === 0) {
    return;
  }

  reports.forEach((report) => {
    const newPeriodId = idMap.get(report.childProgressReportPeriodId);
    if (newPeriodId) {
      report.childProgressReportPeriodId = newPeriodId;
      report.synced = false;
    }
  });
}

const initialState: ProgressTrackingState = {
  currentLocale: 'en-za',
  progressTrackingContentByLocale: {},
  progressTrackingAgeGroups: { data: [], dateRefreshed: undefined },
  resourceLinks: undefined,
  practitionerProgressReportSummary: undefined,

  childProgressReports: [],
};

const progressTrackingSlice = createSlice({
  name: 'progressTracking',
  initialState,
  reducers: {
    resetProgressTrackingState: (state) => {
      state.progressTrackingAgeGroups = initialState.progressTrackingAgeGroups;
      state.resourceLinks = initialState.resourceLinks;
      state.practitionerProgressReportSummary =
        initialState?.practitionerProgressReportSummary;
    },
    remapChildProgressReportId: (
      state,
      action: PayloadAction<{ oldId: string; newId: string }>
    ) => {
      const { oldId, newId } = action.payload;

      const index = state.childProgressReports.findIndex((x) => x.id === oldId);
      if (index !== -1) {
        // Replace the ID while preserving all other data and marking it as needing sync consideration
        const existing = state.childProgressReports[index];
        state.childProgressReports[index] = {
          ...existing,
          id: newId,
          // Keep synced as false until the next successful sync round confirms it
          synced: false,
        };
      }
    },
    setLocale: (
      state,
      action: PayloadAction<{
        localeId: string;
      }>
    ) => {
      state.currentLocale = action.payload.localeId;
    },
    updateSkill: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        skillId: number;
        value: ProgressSkillValues;
      }>
    ) => {
      const { childId, reportingPeriodId, skillId, value } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report) {
        // No current report so, create and add our first skill
        state.childProgressReports = [
          ...state.childProgressReports,
          {
            id: newGuid(),
            dateCreated: new Date().toDateString(),
            childId: childId,
            childProgressReportPeriodId: reportingPeriodId,
            synced: false,
            skillsToWorkOn: [],
            skillObservations: [
              {
                skillId: skillId,
                value: value,
              },
            ],
          },
        ];
      } else {
        // Update existing report
        state.childProgressReports = [
          ...state.childProgressReports.filter((x) => x.id !== report.id),
          {
            ...report,
            synced: false,
            skillObservations: [
              ...report.skillObservations.filter((x) => x.skillId !== skillId),
              { skillId, value },
            ],
            // Filter out any skills to work, if they changed the answer to yes
            skillsToWorkOn:
              value === ProgressSkillValues.Yes
                ? [
                    ...report.skillsToWorkOn.filter(
                      (x) => x.skillId !== skillId
                    ),
                  ]
                : [...report.skillsToWorkOn],
          },
        ];
      }
    },
    addSkillToWorkOn: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        skillId: number;
      }>
    ) => {
      const { childId, reportingPeriodId, skillId } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report || report.skillsToWorkOn.some((x) => x.skillId === skillId)) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          skillsToWorkOn: [
            ...report.skillsToWorkOn,
            { skillId, howToSupport: '' },
          ],
        },
      ];
    },
    removeSkillToWorkOn: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        skillId: number;
      }>
    ) => {
      const { childId, reportingPeriodId, skillId } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          skillsToWorkOn: [
            ...report.skillsToWorkOn.filter((x) => x.skillId !== skillId),
          ],
        },
      ];
    },
    updateSkillToWorkOn: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        skillId: number;
        value: string;
      }>
    ) => {
      const { childId, reportingPeriodId, skillId, value } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          skillsToWorkOn: [
            ...report.skillsToWorkOn.filter((x) => x.skillId !== skillId),
            { skillId: skillId, howToSupport: value },
          ],
        },
      ];
    },
    updateHowToSupport: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        value: string;
      }>
    ) => {
      const { childId, reportingPeriodId, value } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          howToSupport: value,
        },
      ];
    },
    updateNotes: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        value: string;
      }>
    ) => {
      const { childId, reportingPeriodId, value } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          notes: value,
        },
      ];
    },
    updateChildEnjoys: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        value: string;
      }>
    ) => {
      const { childId, reportingPeriodId, value } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          childEnjoys: value,
        },
      ];
    },
    updateGoodProgressWith: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        value: string;
      }>
    ) => {
      const { childId, reportingPeriodId, value } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          goodProgressWith: value,
        },
      ];
    },
    updateHowCanCaregiverSupport: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        value: string;
      }>
    ) => {
      const { childId, reportingPeriodId, value } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          howCanCaregiverSupport: value,
        },
      ];
    },
    setReportObservationDateComplete: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
      }>
    ) => {
      const { childId, reportingPeriodId } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          observationsCompleteDate: new Date().toISOString(),
        },
      ];
    },
    resetReportObservationDateComplete: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
      }>
    ) => {
      const { childId, reportingPeriodId } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          observationsCompleteDate: undefined,
        },
      ];
    },
    markAllSkillsObserved: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
      }>
    ) => {
      const { childId, reportingPeriodId } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report || !!report.observationsCompleteDate) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          observationsCompleteDate: new Date().toISOString(),
        },
      ];
    },
    completeReport: (
      state,
      action: PayloadAction<{
        childId: string;
        reportingPeriodId: string;
        classroomName: string;
        practitionerName: string;
        principalName: string;
        principalPhoneNumber: string;
      }>
    ) => {
      const {
        childId,
        reportingPeriodId,
        classroomName,
        practitionerName,
        principalName,
        principalPhoneNumber,
      } = action.payload;

      const report = state.childProgressReports.find(
        (x) =>
          x.childId === childId &&
          x.childProgressReportPeriodId === reportingPeriodId
      );

      if (!report || !!report.dateCompleted) {
        return;
      }

      state.childProgressReports = [
        ...state.childProgressReports.filter((x) => x.id !== report.id),
        {
          ...report,
          synced: false,
          dateCompleted: new Date().toISOString(),
          classroomName: classroomName,
          practitionerName: practitionerName,
          principalName: principalName,
          principalPhoneNumber: principalPhoneNumber,
        },
      ];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getChildProgressReports.fulfilled, (state, action) => {
      if (action.payload && action.payload.length) {
        const unsyncedReports = state.childProgressReports.filter(
          (x) => !x.synced
        );

        state.childProgressReports = [
          ...unsyncedReports,
          ...action.payload
            .filter((x) => unsyncedReports.every((y) => y.id !== x.id))
            .map((item) => ({
              ...item,
              synced: true,
            })),
        ];
      }
    });
    builder.addCase(
      getChildProgressReportsForPractitioner.fulfilled,
      (state, action) => {
        if (action.payload && action.payload.length) {
          const unsyncedReports = state.childProgressReports.filter(
            (x) => !x.synced
          );

          state.childProgressReports = [
            ...unsyncedReports,
            ...action.payload
              .filter((x) => unsyncedReports.every((y) => y.id !== x.id))
              .map((item) => ({
                ...item,
                synced: true,
              })),
          ];
        }
      }
    );
    builder.addCase(getProgressTrackingAgeGroups.fulfilled, (state, action) => {
      state.progressTrackingAgeGroups = {
        data: [
          ...action.payload.map((x) => ({
            id: x.id,
            name: x.name,
            startAgeInMonths: Number(x.startAgeInMonths),
            endAgeInMonths: Number(x.endAgeInMonths),
            color: x.color,
            description: x.description,
            skills: x.skills,
          })),
        ],
        dateRefreshed: new Date().toDateString(),
      };
    });
    builder.addCase(getProgressTrackingContent.fulfilled, (state, action) => {
      const locale = action.meta.arg.locale;
      state.progressTrackingContentByLocale[locale] = {
        data: action.payload,
        dateRefreshed: new Date().toDateString(),
      };
    });
    builder.addCase(getResourceLinks.fulfilled, (state, action) => {
      state.resourceLinks = action.payload;
    });
    builder.addCase(
      getPractitionerProgressReportSummary.fulfilled,
      (state, action) => {
        state.practitionerProgressReportSummary = action.payload;
      }
    );
    builder.addCase(syncChildProgressReports.fulfilled, (state, action) => {
      state.childProgressReports = state.childProgressReports.map((x) => ({
        ...x,
        synced: true,
      }));
    });
    // Online path: periods created interactively. The arg carries the submitted
    // (local) periods; the payload carries the authoritative server set.
    builder.addCase(
      addChildProgressReportPeriods.fulfilled,
      (state, action) => {
        remapReportsToServerPeriods(
          state.childProgressReports,
          action.meta.arg.childProgressReportPeriods,
          action.payload
        );
      }
    );
    // Offline-sync path: the thunk arg is empty, so it returns both the submitted
    // and the authoritative server periods for the same reconciliation.
    builder.addCase(
      upsertChildProgressReportPeriods.fulfilled,
      (state, action) => {
        const { serverPeriods, submittedPeriods } = action.payload;
        remapReportsToServerPeriods(
          state.childProgressReports,
          submittedPeriods,
          serverPeriods
        );
      }
    );
  },
});

const { reducer: progressTrackingReducer, actions: progressTrackingActions } =
  progressTrackingSlice;

export const { remapChildProgressReportId } = progressTrackingActions;

const progressTrackingPersistConfig = {
  key: 'progressTracking',
  storage: localForage,
  blacklist: [],
};

export {
  progressTrackingPersistConfig,
  progressTrackingReducer,
  progressTrackingActions,
};
