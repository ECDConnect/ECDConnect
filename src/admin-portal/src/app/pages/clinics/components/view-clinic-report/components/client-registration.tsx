import { Divider, Typography } from '@ecdlink/ui';
import Pregnant from '../../../../../../assets/gg-icons/pregnant.svg';
import Infant from '../../../../../../assets/gg-icons/infant.svg';
import Nutrition from '../../../../../../assets/gg-icons/nutrition.svg';
import HealthCare from '../../../../../../assets/gg-icons/healthcare.svg';
import Protection from '../../../../../../assets/gg-icons/protection.svg';

interface ClientRegistrationProps {
  totalCaregiversAttended: number;
  totalClubsHeld: number;
  totalGrowthMonitored: number;
  totalSupportGrant: number;
  totalUpToDateDeworming: number;
  totalUpToDateImmunisations: number;
  totalUpToDateVitaminA: number;
  totalChildFoldersOpened: number;
  totalMotherFoldersBefore20WeeksOpened: number;
  totalMotherFoldersOpened: number;
  totalAlcoholAbuse: number;
  totalMaternalDistress: number;
  totalMaternalMalnutrition: number;
}

export const ClientRegistration: React.FC<ClientRegistrationProps> = ({
  totalCaregiversAttended,
  totalClubsHeld,
  totalGrowthMonitored,
  totalSupportGrant,
  totalUpToDateDeworming,
  totalUpToDateImmunisations,
  totalUpToDateVitaminA,
  totalChildFoldersOpened,
  totalMotherFoldersBefore20WeeksOpened,
  totalMotherFoldersOpened,
  totalAlcoholAbuse,
  totalMaternalDistress,
  totalMaternalMalnutrition,
}) => {
  return (
    <div className="mt-8 rounded-2xl bg-white p-8">
      <div>
        <div>
          <Typography
            type="h4"
            color="textDark"
            text={`Client registration`}
            align="left"
          />
          <Typography
            type="help"
            color="textMid"
            text={`Number of folders opened`}
            align="left"
          />
        </div>
        <Divider className="p-4" dividerType="dashed" />
        <div className="mt-2 grid grid-cols-3 justify-around gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={Infant} alt="infant" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalChildFoldersOpened}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`child folders opened`}
                align="left"
                className="w-44"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={Pregnant} alt="pregnant" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalMotherFoldersOpened}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`pregnant mom folders opened`}
                align="left"
                className="w-44"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={Pregnant} alt="pregnant" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalMotherFoldersBefore20WeeksOpened}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`pregnant mom folders opened before 20 weeks of pregnancy `}
                align="left"
                className="w-44"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <div>
          <Typography
            type="h4"
            color="textDark"
            text={`Pregnant mom clients`}
            align="left"
          />
        </div>
        <Divider className="p-4" dividerType="dashed" />
        <div className="mt-2 grid grid-cols-3 justify-around gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={Pregnant} alt="preg" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalMaternalDistress}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`clients screened for maternal distress`}
                align="left"
                className="w-44"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-secondaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={Nutrition} alt="bowl" className="h-5 w-5" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalMaternalMalnutrition}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`clients screened for maternal malnutrition`}
                align="left"
                className="w-44"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-primaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={Pregnant} alt="pregnant" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalAlcoholAbuse}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`clients screened for alcohol abuse`}
                align="left"
                className="w-44"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12">
        <div>
          <Typography
            type="h4"
            color="textDark"
            text={`Child clients`}
            align="left"
          />
        </div>
        <Divider className="p-4" dividerType="dashed" />
        <div className="mt-2 grid grid-cols-3 justify-around gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-tertiaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={HealthCare} alt="healthcare" className="h-5 w-5" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalSupportGrant}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`child clients are receiving the child support grant`}
                align="left"
                className="w-44"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-secondaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={Nutrition} alt="bowl" className="h-5 w-5" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalGrowthMonitored}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`children's growth monitored`}
                align="left"
                className="w-44"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-quaternaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={Protection} alt="pregnant" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalUpToDateImmunisations}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`children up to date with immunisations`}
                align="left"
                className="w-44"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-quaternaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={Protection} alt="preg" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalUpToDateVitaminA}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`children up to date with Vitamin A supplements`}
                align="left"
                className="w-44"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-quaternaryGG flex h-8 w-8 items-center justify-center rounded-full">
              <img src={Protection} alt="preg" />
            </div>
            <div>
              <Typography
                type="h4"
                color="textDark"
                text={`${totalCaregiversAttended}`}
                align="left"
              />
              <Typography
                type="help"
                color="textMid"
                text={`children up to date with deworming`}
                align="left"
                className="w-44"
              />
            </div>
          </div>
        </div>
        <div className="mt-12">
          <div>
            <Typography
              type="h4"
              color="textDark"
              text={`Breastfeeding clubs`}
              align="left"
            />
          </div>
          <Divider className="p-4" dividerType="dashed" />
          <div className="mt-2 grid grid-cols-3 justify-around">
            <div className="flex items-center gap-2">
              <div className="bg-secondaryGG flex h-8 w-8 items-center justify-center rounded-full">
                <img src={Nutrition} alt="preg" className="h-5 w-5" />
              </div>
              <div>
                <Typography
                  type="h4"
                  color="textDark"
                  text={`${totalClubsHeld}`}
                  align="left"
                />
                <Typography
                  type="help"
                  color="textMid"
                  text={`breastfeeding clubs held`}
                  align="left"
                  className="w-44"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-secondaryGG flex h-8 w-8 items-center justify-center rounded-full">
                <img src={Nutrition} alt="bowl" className="h-5 w-5" />
              </div>
              <div>
                <Typography
                  type="h4"
                  color="textDark"
                  text={`${totalCaregiversAttended}`}
                  align="left"
                />
                <Typography
                  type="help"
                  color="textMid"
                  text={`caregivers attended breastfeeding clubs`}
                  align="left"
                  className="w-44"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
