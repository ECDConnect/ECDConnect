using ECDLink.Abstractrions.Enums;
using System;

namespace EcdLink.Api.CoreApi
{
    public static class Constants
    {
        public static class ApplicationSettings
        {
            public const string DefaultDbConnection = "ConnectionStrings:DefaultConnection";

            public const string GraphEndPoint = "GraphQl:EndPoint";
        }

        public static class SSSettings
        {
            public const string client_practitioner = "practitioner";
            public const string client_coach = "coach";

            // Visit types
            public const string visitType_pre_pqa_visit_1 = "pre_pqa_visit_1";
            public const string visitType_pre_pqa_visit_2 = "pre_pqa_visit_2";
            public const string visitType_support = "support_visit";
            public const string visitType_call = "support_call";

            public const string visitType_pqa_visit_1 = "pqa_visit_1";
            public const string visitType_pqa_visit_follow_up = "pqa_visit_follow_up";

            public const string visitType_re_accreditation_1 = "re_accreditation_1";
            public const string visitType_re_accreditation_follow_up = "re_accreditation_follow_up";

            public const string visitType_self_assessment = "self_assessment";

            public const string visitType_practitioner_visit = "practitioner_visit";
            public const string visitType_practitioner_call = "practitioner_call";
            public const string answer_yes = "true";
            public const string answer_no = "false";

            public const string section_discussion = "Discussion notes";
            public const string question_next_steps = "What next steps did you agree on?";
            public const string question_next_steps_step4 = "What next steps or plans to improve did you discuss with {client}?";

            // Licences
            public const string ss_starter_licence = "ss_starter_licence";
            public const string ss_smart_space_licence = "ss_smart_space_licence";
            public const string ss_practice_licence = "ss_practice_licence";

            // Timeline messages
            public const string starter_licence_received = "Starter Licence received";
            public const string starter_licence_not_received = "Starter Licence not received";

            public const string smart_space_licence_received = "SmartSpace Licence received";
            public const string smart_space_licence_not_received = "SmartSpace Licence not received";

            public const string practice_licence_received = "PQA: Practice Licence awarded";
            public const string practice_licence_not_received = "PQA: Practice Licence not received";

            public const string first_site_visit = "First site visit before PQA";
            public const string second_site_visit = "Second site visit before PQA";

            public const string income_statement_pdf_type = "IncomeStatementPDF";
            public const string attendance_pdf_type = "AttendancePDF";
            public const string workflow_pdf_type = "Document";
            public const string workflow_status_pdf_type = "Verified";

            // PQA Visit Questions
            public const string step2_section = "Step 2";
            public const string step2 = "A stimulating & adequately resourced learning environment";
            public const string step2_q1 = "Supervision";
            public const string step2_q1_a1 = "0 - Children were often left unsupervised (3 times or more in a session).";
            public const string step2_q1_a2 = "1 - Children were usually supervised (unsupervised 2 times or less in a session).";
            public const string step2_q1_a3 = "2 - Children were supervised at all times.";

            public const string step2_q2 = "Learning space";
            public const string step2_q2_a1 = "0 - The space was not divided into interest areas.";
            public const string step2_q2_a2 = "1 - The space was divided into two interest areas.";
            public const string step2_q2_a3 = "2 - The space was divided into 3 or more interest areas.";

            public const string step2_q3 = "Using the toy kit";
            public const string step2_q3_a1 = "0 - The play kit was not unpacked into the learning space.";
            public const string step2_q3_a2 = "1 - The play kit was only unpacked and available for children's use for a short time (less than 40 mins of the session).";
            public const string step2_q3_a3 = "2 - The play kit was unpacked and the materials were available for children's play for more than 40 mins of the session.";

            public const string step2_q4 = "Labelling (symbols or words)";
            public const string step2_q4_a1 = "0 - Interest areas and materials were not labelled.";
            public const string step2_q4_a2 = "1 - Some interest areas and play materials were labelled.";
            public const string step2_q4_a3 = "2 - All interest areas and play materials were labelled.";

            public const string step2_q5 = "Toys & storybooks";
            public const string step2_q5_a1 = "0 - Toys and storybooks were kept out of children's reach.";
            public const string step2_q5_a2 = "1 - Children could reach and get out some toys and storybooks without adult help.";
            public const string step2_q5_a3 = "2 - Children could reach and get out most of the toys and storybooks without adult help.";

            public const string step2_q6 = "Displays";
            public const string step2_q6_a1 = "0 - There were not posters or examples of children's work displayed.";
            public const string step2_q6_a2 = "1 - There were a few posters or examples of children's work displayed (fewer than 5).";
            public const string step2_q6_a3 = "2 - There were lots of posters or examples of children's work displayed (5 or more total).";

            public const string step3_section = "Step 3";
            public const string step3 = "Consistent use of the SmartStart routine";
            public const string step3_q1 = "Which of these did you see during the session?";
            public const string step3_q1_a1 = "The venue has enough clean, safe water for children to drink.";
            public const string step3_q1_a2 = "Greeting time";
            public const string step3_q1_a3 = "Message board";
            public const string step3_q1_a4 = "Small group activity";
            public const string step3_q1_a5 = "Planning time";
            public const string step3_q1_a6 = "Play time";
            public const string step3_q1_a7 = "Clean up time";
            public const string step3_q1_a8 = "Recall time";
            public const string step3_q1_a9 = "Large group activity";
            public const string step3_q1_a10 = "Story time";
            public const string step3_q1_a11 = "Outside time";
            public const string step3_q1_a12 = "None";

            // step 3 and step 4 is the same
            public const string step4_section = "Step 4";
            public const string step4 = "Consistent use of the SmartStart routine";
            public const string step4_q1 = "SmartStart routine";
            public const string step4_q1_a1 = "0 - The SmartStart routine is not displayed and children do not refer to the names of the different parts of the routine.";
            public const string step4_q1_a2 = "1 - The SmartStart routine is displayed so adults can see it, but the children are unable to.  Adults and children sometimes refer to the names of the different parts of the routine.";
            public const string step4_q1_a3 = "2 - The SmartStart routine is displayed for everyone to see and in a form understandable to children (e.g. pictures or symbols).  Adults and children often refer to the names of parts of the routine.";

            public const string step4_q2 = "Small group time";
            public const string step4_q2_a1 = "0 - No time was set aside for small group activities with the children.";
            public const string step4_q2_a2 = "1 - The small group activity was too short (less than 10 mins) or only some children had an opportunity to join in.";
            public const string step4_q2_a3 = "2 - The small group activity lasted for more than 10 mins and all the children participated.";

            public const string step4_q3 = "Making plans";
            public const string step4_q3_a1 = "0 - There was no time set aside for children to make plans and/or to indicate their plans to adults.";
            public const string step4_q3_a2 = "1 - Only some children had the chance to make plans and/or to indicate their plans to adults.";
            public const string step4_q3_a3 = "2 - All children had the chance to make plans and/or to indicate their plans to adults.";

            public const string step4_q4 = "Free play";
            public const string step4_q4_a1 = "0 - There was no time to set aside for free play - when children choose or initiate activities.";
            public const string step4_q4_a2 = "1 - There was some time set aside for free play - when children choose or initiate activities and can carry out their plans (30-45 mins).";
            public const string step4_q4_a3 = "2 - There was substantial time set aside for free play - when children choose or initiate activities and can carry out their plans (at least 45-55 mins).";

            public const string step4_q5 = "Recall";
            public const string step4_q5_a1 = "0 - There was no time set aside for children to recall or reflect on their activities.";
            public const string step4_q5_a2 = "1 - There was some time set aside for children to recall or reflect on their activities, but not all children had the chance to participate.";
            public const string step4_q5_a3 = "2 - There was enough time set aside for all the children to recall and reflect on their activities.";

            public const string step4_q6 = "Story time";
            public const string step4_q6_a1 = "0 - There was no time set aside for story time.";
            public const string step4_q6_a2 = "1 - There was a short time set aside for story time (less than 15 mins).";
            public const string step4_q6_a3 = "2 - There was a substantial time set aside for story time (at least 15-20 mins).";

            public const string step4_q7 = "Large group time";
            public const string step4_q7_a1 = "0 - There was no time set aside for large group activity.";
            public const string step4_q7_a2 = "1 - The large group activity was too short (less than 10 minutes).";
            public const string step4_q7_a3 = "2 - The large group activity lasted for more than 10 minutes.";

            public const string step5_section = "Step 5";
            public const string step5 = "A stable & nurturing environment where children feel safe & loved";
            public const string step5_q1 = "Warm & respectful interactions";
            public const string step5_q1_a1 = "0 - Adults were not warm and respectful when interacting with children.";
            public const string step5_q1_a2 = "1 - Adults spoke and acted warmly and respectfully towards children some of the time, or only to some children.";
            public const string step5_q1_a3 = "2 - Adults spoke and acted warmly and respectfully towards children, using appropriate methods (e.g. smile, hug, nod, calm voice, making eye contact, getting down to child's level, listening attentively).";

            public const string step5_q2 = "Individual attention";
            public const string step5_q2_a1 = "0 - Adults provided no children with individual attention.";
            public const string step5_q2_a2 = "1 - Adults provided some but not all children with individual attention.";
            public const string step5_q2_a3 = "2 - Adults offered positive, individual attention to all children.";

            public const string step5_q3 = "Acknowledgement & encouragement";
            public const string step5_q3_a1 = "0 - Adults rarely noticed or acknowledge children's efforts and ideas, and tended to be critical.";
            public const string step5_q3_a2 = "1 - Adults did not always notice or acknowledge children's efforts and ideas.  Adults gave some praise but were also critical.";
            public const string step5_q3_a3 = "2 - Adults acknowledge children's efforts and ideas (for example, by repeating their idea or describing what they had done), and offered encouragement and praise.";

            public const string step5_q4 = "Looking after upset children";
            public const string step5_q4_a1 = "0 - Adults did not attend to children who were upset.";
            public const string step5_q4_a2 = "1 - Adults sometimes attended to children who were upset, or were slow to attend to upset children.";
            public const string step5_q4_a3 = "2 - Adults always attended and offered appropriate comfort to children who were upset.";

            public const string step5_q5 = "Maintaining order";
            public const string step5_q5_a1 = "0 - Adults used harsh and sometimes physical methods to maintain order, such as handling the children roughly or using unkind or rude language.";
            public const string step5_q5_a2 = "1 - Adults sometimes used harsh words, a raised voice or confrontational methods to deal with disorder or poor behaviour.";
            public const string step5_q5_a3 = "2 - Adults use appropriate and consistent methods to maintain order (such as diverting children, using a calm voice) and never used harsh or physical methods.";

            public const string step5_q6 = "Resolving conflict";
            public const string step5_q6_a1 = "0 - Adults imposed solutions to conflicts without consulting children, and punished children before talking to them properly.";
            public const string step5_q6_a2 = "1 - Adults sometimes imposed solutions to conflicts and did not make enough effort to involve children, listen to their accounts and acknowledge their feelings and ideas.";
            public const string step5_q6_a3 = "2 - Adults actively involved children in solving conflicts, by acknowledging their feelings, listening carefully to their accounts and trying their solutions.";

            public const string step6_section = "Step 6";
            public const string step6 = "Positive & plentiful adult-child interactions which encourage a rich use of language";
            public const string step6_q1 = "Talking to children & encouraging communication";
            public const string step6_q1_a1 = "0 - Adults rarely talked to children and did not create opportunities for conversation.  Adults mostly talked to children to give instructions and maintain order.";
            public const string step6_q1_a2 = "1 - There was some adult-child conversation and some activities were used to encourage children to communicate.";
            public const string step6_q1_a3 = "2 - Adults talked frequently with children throughout the session for varied purposes, and created lots of opportunities.";

            public const string step6_q2 = "Listening & responding";
            public const string step6_q2_a1 = "0 - Adults often ignored children's questions and comments and did not listen carefully to children.";
            public const string step6_q2_a2 = "1 - Adults responded to children's comments and questions only some of the time.  Adults did not always listen carefully to children.";
            public const string step6_q2_a3 = "2 - Adults responded respectfully to children's comments and questions, and listened carefully to children.";

            public const string step6_q3 = "Using talk to extend learning";
            public const string step6_q3_a1 = "0 - Adults did not use comments and questions to encourage children to talk about what they were doing to extend their learning.";
            public const string step6_q3_a2 = "1 - Adults sometimes encouraged children to talk about what they were doing, but missed opportunities to prompt children to explain their thinking and reasoning.";
            public const string step6_q3_a3 = "2 - Adults encouraged children to talk about what they were doing made appropriate use of questions and comments to prompt children to explain their thinking and reasoning.";

            public const string step6_q4 = "Building language";
            public const string step6_q4_a1 = "0 - Adults did not try to build children's language.";
            public const string step6_q4_a2 = "1 - Adults sometimes built children's language through suggesting and explaining new words.";
            public const string step6_q4_a3 = "2 - Adults frequently used appropriate methods to build children's language, such as introducing or explaining new words or repeating something a child had said using the correct language.";

            public const string step6_q5 = "Encouraging initiative";
            public const string step6_q5_a1 = "0 - Adults told children how to carry out activities or use materials and did not let them make choices or do things for themselves.";
            public const string step6_q5_a2 = "1 - Adults sometimes encouraged children to mak their own choices and to do things for themselves (such as put on their shoes or pour water).";
            public const string step6_q5_a3 = "2 - Adults often encouraged children to make choices about how to use materials and carry out activities.  Adults allowed children to do things for themselves where developmentally appropriate.";

            public const string step7_section = "Step 7";
            public const string step7_q1 = "Letting children make choices";
            public const string step7_q1_a1 = "0 - Adults told most children what to do during free play.";
            public const string step7_q1_a2 = "1 - Only some children were allowed to make their own choices during free play and other children were told what to do by adults.";
            public const string step7_q1_a3 = "2 - All children were allowed to make their own choices during free play and give support to do so when needed.";

            public const string step7 = "Opportunities for child-directed, open-ended play, supported & directed by adults";
            public const string step7_q2 = "Facilitating children's play";
            public const string step7_q2_a1 = "0 - Adults made little or no effort to make available toys and materials that stimulated children's imagination during play, and to support them to use them.";
            public const string step7_q2_a2 = "1 - Adults made available some toys and materials that stimulated children's imagination and supported some children to use them, but there was not a sufficient range of resources to engage all children.";
            public const string step7_q2_a3 = "2 - Adults facilitated children's play by making available toys and materials that stimulated children's imagination and by supporting them to use them when needed.";

            public const string step7_q3 = "Participating in children's play";
            public const string step7_q3_a1 = "0 - Adults did not participate in children's play, and only supervised from the side.";
            public const string step7_q3_a2 = "1 - Adults sometimes participated in children's play but were not involved for all of the time or only played with a few children.";
            public const string step7_q3_a3 = "2 - Adults participated as partners in children's self-initiated play, and tried to play with different children.";

            public const string step7_q4 = "Extending learning through play";
            public const string step7_q4_a1 = "0 - Adults did not try to build children's understanding during free play.";
            public const string step7_q4_a2 = "1 - Adults used appropriate techniques to build children's understanding some for the time and with some children.";
            public const string step7_q4_a3 = "2 - Throughout free play, adults added information and used observations, questions and modelling to expand on children's ideas and build new understanding.";

            public const string step7_q5 = "Ensuring play & learning is at the right level";
            public const string step7_q5_a1 = "0 - Adults made children participate in activities that were significantly too easy or too hard for them.";
            public const string step7_q5_a2 = "1 - Adults did not always seem aware what level of activity or game was appropriate for the child.";
            public const string step7_q5_a3 = "2 - Adults allowed children to play and learn at a level and pace which was appropriate for them.";

            public const string step8_section = "Step 8";
            public const string step8 = "Interactive storytelling which introduces children to new language & learning";
            public const string step8_q1 = "Encouraging conversation during story time";
            public const string step8_q1_a1 = "0 - Adults did not allow any interaction with children during story time and did not invite children's contributions.";
            public const string step8_q1_a2 = "1 - Adults allowed some interaction with children during story time, but there were only limited contributions from children.";
            public const string step8_q1_a3 = "2 - Adults used oral storytelling and booksharing to create an interactive story-time that was full of conversation (for example, children were allowed to ask questions and adults paused to talk about the story and to invite children's responses).";

            public const string step8_q2 = "Explaining new words & ideas";
            public const string step8_q2_a1 = "0 - Adults made no effort to explain new language and concepts during story time.";
            public const string step8_q2_a2 = "1 - Adults explained some new language and concepts during story time, but it is likely that some children still struggled to understand.";
            public const string step8_q2_a3 = "2 - Adults introduced and explained new language and concepts during story time.";

            public const string step8_q3 = "Asking questions & helping children to think";
            public const string step8_q3_a1 = "0 - Adults did not ask any questions during story time.";
            public const string step8_q3_a2 = "1 - Adults tended to ask questions that invited one or two-word answers, and did not ask questions that helped children to think and reflect.";
            public const string step8_q3_a3 = "2 - Adults used open-ended questions and comments during story time to enable children to practise thinking skills such as predicting and reasoning.";

            public const string step8_q4 = "Helping children to become familiar with books & print";
            public const string step8_q4_a1 = "0 - If using a storybook, adults did not point to the words or explain anything about print of books during story time.";
            public const string step8_q4_a2 = "1 - If sharing a storybook, adults made a limited effort to help children become familiar with books or print (for example by pointing to a word or showing how to hold the book).";
            public const string step8_q4_a3 = "2 - If sharing a storybook, adults did so in ways that helped children become familiar with books and print by (for example, point to letters, words and sentences, and showing that the book is read from left to right, explaining the cover).";

            public const string step11_q1 = "Do you have concerns about health & safety at this venue?";

            public const string step12_section = "Step 12";
            public const string step12_q1 = "Walk around the site and make sure the following standards are in place.";
            public const string step12_q1_b = "{client} - SmartSpace check";
            public const string step12_q1_a1 = "The venue has enough clean, safe water for children to drink.";
            public const string step12_q1_a2 = "The venue has a safe, clean and hygienic place for children to go to the toilet.";
            public const string step12_q1_a3 = "There is a tap, a tippy-tap, a water dispenser or similar for handwashing under clean running water with measures that allow for physical distancing as appropriate.";
            public const string step12_q1_a4 = "Medicines and harmful substances are out of reach of children.";
            public const string step12_q1_a5 = "Children cannot reach matches, lighters or paraffin.";
            public const string step12_q1_a6 = "Children cannot reach or step on sharp objects or other dangerous objects.";
            public const string step12_q1_a7 = "Children cannot reach hot cooker plates or pans on the cooker.";
            public const string step12_q1_a8 = "There is no open water (where children could fall and drown).";
            public const string step12_q1_a9 = "There are no exposed electrical wires or electric sockets that children can reach.";
            public const string step12_q1_a10 = "There is no smoking or open fires in the venue.";
            public const string step12_q1_a11 = "There are no heights or steps from which children could fall.";
            public const string step12_q1_a12 = "No dangerous animals can approach the venue.";
            public const string step12_q1_a13 = "If children use an outdoor area, it is clean, with no litter or animal faeces.";
            public const string step12_q1_a14 = "The venue is in an area that is known as a safe place in the community.";
            public const string step12_q1_a15 = "There is at minimum a bucket of sand available in case of fires or fire blanket or extinguisher.";
            public const string step12_q1_a15b = "There is at minimum a bucket of sand available in case of fires or the fire blanket or extinguisher.";
            public const string step12_q1_a16 = "There is a basic first aid kit in case of accidents.";
            public const string step12_q1_a17 = "There is an emergency plan displayed on the wall (can use one from Starter pack).";
            public const string step12_q1_a18 = "There is an emergency plan displayed on the wall (can use one from Start pack).";

            public const string step13_q1 = "These standards are also required.  If they are not in place, SmartStarters should be able to show how they are working towards them.";

            public const string step13_q1_b = "Additional standards";
            public const string step13_q1_a1 = "The venue offers children enough space to play freely (about one square metre per child).";
            public const string step13_q1_a2 = "If children use an outdoor area, it is fenced with a lockable gate.";
            public const string step13_q1_a3 = "There is a list of emergency numbers visible on the wall.";
            public const string step13_q1_a4 = "The venue has good natural ventilation (windows or doors that can open).";
            public const string step13_q1_a5 = "The programme does not exceed the maximum child number per programme type.";

            public const string step14_q1 = "Are you re-issuing the SmartSpace certificate for {client}’s venue?";
            public const string step14_success = "{client} venue meets all the basic SmartSpace standards as well as the additional standards.";
            public const string step14_not_reissue = "You cannot reissue {client}'s SmartSpace Licence.";
            public const string step14_not_meet = "{client}'s venue does not meet the basic SmartSpace standards.";

            public const string step16_q1 = "Did you observe an adult hitting or smacking a child at this programme?";
            public const string step16_q2 = "Is the SmartStart programme being implemented where children feel save & loved?";
            public const string step16_q3 = "Is the SmartStart programme being implemented for long enough?";
            public const string step16_q4 = "Are there too many children attending the SmartStart programme?";
            public const string step16_q5 = "Are there enough assistants for the programme?";

            public const string step_8_section = "Step 8";
            public const string step_8_re_accreditation = "A. The learning environment & use of the SmartStart routine";
            public const string step_10_re_accreditation = "B. Programme implementation";
            public const string step_11_re_accreditation = "C. Records";
            public const string step_12_re_accreditation = "D. Operational standards";

            public const string step8_re_accreditation_a1 = "Supervision: children are supervised at all times.";
            public const string step8_re_accreditation_a2 = "Learning space: the space is divided into 3 or more interest areas, which are labelled.";
            public const string step8_re_accreditation_a3 = "Using the toy kit: the play kit is unpacked and children can reach toys and story books.";
            public const string step8_re_accreditation_a4 = "Displays: the learning space is interesting with posters and children�s work on the walls.";
            public const string step8_re_accreditation_a5 = "SmartStart routine: the SmartStart routine is displayed at a height that children can reach.";
            public const string step8_re_accreditation_a6 = "SmartStart activities: all the activities in the SmartStart routine (below) were included today.";
            public const string step8_re_accreditation_a7 = "Free play: at least 45 minutes was set aside for free play.";
            public const string step8_re_accreditation_a8 = "Planning & recall: children had the chance to plan and recall activities before and after free play.";
            public const string step8_re_accreditation_a9 = "Small group time: there was small group time (at least 15 minutes).";
            public const string step8_re_accreditation_a10 = "Story time: there was story time (at least 20 minutes).";
            public const string step8_re_accreditation_a11 = "Large group time: there was large group time (at least 15 minutes).";
            public const string step8_re_accreditation_a12 = "Message board: the message board is up to date.";


            public const string step_10_section = "Step 10";
            public const string step_10_re_accreditation_q1 = "Adults speak and act warmly & respectfully to children.";
            public const string step_10_re_accreditation_q2 = "Adults offer individual attention to children, and give encouragement.";
            public const string step_10_re_accreditation_q3 = "Adults use calm and appropriate methods to keep order, and do not use harsh words, a raised voice or physical methods.";
            public const string step_10_re_accreditation_q4 = "Children are comforted if they are upset.";
            public const string step_10_re_accreditation_q5 = "Children are involved in solving conflicts.";
            public const string step_10_re_accreditation_q6 = "Adults create opportunities to talk with children, and listen and respond to their questions and ideas.";
            public const string step_10_re_accreditation_q7 = "Adults encourage children to make their own choices during the session and to do things for themselves where they can.";
            public const string step_10_re_accreditation_q8 = "Adults join in as a partner in children�s play, encourage children to talk about what they are doing, and use comments and questions to help children learn.";
            public const string step_10_re_accreditation_q9 = "Adults use appropriate activities and materials for the different ages and stages of children.";
            public const string step_10_re_accreditation_q10 = "During story time there is lots of conversation and children are encouraged to take part and ask questions.";

            public const string step_11_section = "Step 11";
            public const string step_11_re_accreditation_a1 = "Register: the attendance register is up to date.";
            public const string step_11_re_accreditation_a2 = "Planning: weekly reflection and planning notes are completed and filed.";
            public const string step_11_re_accreditation_a3 = "Activities: planning notes are filed and show a variety of small and large group activities are being used.";
            public const string step_11_re_accreditation_a4 = "Child progress: the child progress tools are completed for each child.";
            public const string step_11_re_accreditation_a5 = "Accidents: there is an accident register.";
            public const string step_11_re_accreditation_a6 = "Caregiver meetings: there are attendance registers for the last two monthly caregiver meetings.";

            public const string step_12_section = "Step 12";
            public const string step_12_re_accreditation_a1 = "Caregiver meetings: the franchisee is organising monthly caregiver meetings (at least 6 in last year).";
            public const string step_12_re_accreditation_a2 = "Club meetings: the franchisee is attending monthly club meetings (at least 9 in the last year).";
            public const string step_12_re_accreditation_a3 = "Age range: all or nearly all (more than 80%) of the children are aged three and four years old.";
            public const string step_12_re_accreditation_a4 = "Dosage: at least three-quarters of children receive a dosage of six hours per week (playgroups) or 20 hours per week (day mothers and ECD centres).";
            public const string step_12_re_accreditation_a5 = "Reports: the Franchisee is submitting child attendance regularly (weekly child attendance received for the last 12 months).";
            public const string step_12_re_accreditation_a6 = "Parent satisfaction: parent satisfaction surveys - 3 surveys with total score from parents of more than 3 (to be collected at the meeting).";

            public const string pqa_visit = "PQA Visit 1";
            public const string pqa_re_accreditation = "Re-accreditation visit";
            public const string smart_space_checklist = "SmartSpace Checklist";

            public const string ss_programme = "Programme details";
            public const string ss_health = "Health, sanitation & safety";
            public const string ss_safety = "Safety - structure, space & area";
            public const string ss_space = "Space & emergency planning";

            public const string coach_smartspace_check = "Coach smartspace check";
            public const string re_accreditation_follow_up = "Is {client} ready for a follow-up reaccreditation visit?";
            public const string pqa_follow_up = "Is {client} ready for a follow-up PQA observation visit?";
            public const string step12 = "Step 12";
            public const string step13 = "Step 13";
            public const int step2_total = 12;
            public const int step3_total = 2;
            public const int step4_total = 14;
            public const int step5_total = 12;
            public const int step6_total = 10;
            public const int step7_total = 10;
            public const int step8_total = 8;
            public const int step12_total = 17;
            public const int step2_re_accreditation_total = 17;
            public const int step3_re_accreditation_total = 5;
            public const int re_accreditation_A_total = 12;
            public const int re_accreditation_B_total = 20;
            public const int re_accreditation_C_total = 6;
            public const int re_accreditation_D_total = 6;
            public const string zero_stars = "0 stars";
            public const string one_star = "1 star";
            public const string two_stars = "2 stars";
            public const string three_stars = "3 stars";
            public const string four_stars = "4 stars";

            // timeline values
            public const string consolidation_meeting = "Consolidation meeting attended";
            public const string no_consolidation_meeting = "Did not attend consolidation meeting";
            public const string checklist_done = "SmartSpace Checklist done";
            public const string children_registered = "3 or more children registered";
            public const string franchisee_signed = "Franchisee agreement signed";
            public const string support_agreement_signed = "Start-up support agreement signed";
            public const string community_support = "Community support gained";
            public const string coach_visit = "SmartSpace visit from coach";
            public const string attended_first_aid = "Attended first aid course";
            public const string not_attended_first_aid = "Did not attend first aid course";
            public const string child_progress_training = "Child progress training";
            public const string self_assessment = "Self-assessment completed";
            public const string consent_type_franchisee = "FranchiseeAgreement";
            public const string consent_type_support_agreement = "StartupSupportAgreement";

            public const string own_property = "Do you own the property where you will run your SmartStart programme?";
            public const string number_assistants = "How many assistants will attend every session?";
            public const string capacity = "Capacity";
            public const string observation_notes = "Observation notes";
            public const string summary_discussion_notes = "Summary of discussion";
            public const string total_children_present = "How many children are present today?";
            public const string smart_space_check = "SmartSpace check";
            public const string franchisee_agreement = "Franchisee agreement";

            public const string franchisee_agreement_q1 = "I agree to take the actions described in the box above in order to meet & maintain all SmartSpace standards.";
            public const string franchisee_agreement_q2 = "I understand that the Club Coach will visit again within 2 weeks to make sure changes have been made and that my Practice Licence may be withdrawn if they have not.";
            public const string franchisee_agreement_q3 = "I understand that I cannot have more children in the programme than my space can accommodate.";

        }
        
    
        public static class PointsEngineSettings
        {
            public const string client_registration = "Client Registration";
            public const string client_registration_ac1 = "Complete the client registration flow for 5 or more children under the age of 2 years old";
            public const string client_registration_ac2 = "Complete client registration flow for 2 or more pregnant women";
            public const string client_registration_ac3 = "Complete the client registration flow for 1-2 pregnant clients who are less than 20 weeks into pregnancy";
            public const string client_registration_ac4 = "Complete the client registration flow for 3 or more pregnant clients who are less than 20 weeks into pregnancy";

            public const string pregnant_mom_clients = "Pregnant Mom Clients";
            public const string pregnant_mom_clients_ac1 = "Screening for maternal distress 'up to date'";
            public const string pregnant_mom_clients_ac2 = "1 referral per month [Screening for maternal distress]";
            public const string pregnant_mom_clients_ac3 = "Screening for maternal malnutrition";
            public const string pregnant_mom_clients_ac4 = "Referral made for maternal malnutrition [Screening for maternal malnutrition]";
            public const string pregnant_mom_clients_ac5 = "Screening for substance abuse 'up to date'";

            public const string child_clients = "Child Clients";
            public const string child_clients_ac1 = "Child support grant - all eligible children accessing the CSG";
            public const string child_clients_ac2 = "Love, play and talk for healthy development guide. All children screened";
            public const string child_clients_ac3 = "Measuring children's growth length";
            public const string child_clients_ac4 = "Measuring childrens' growth length - referral not required";
            public const string child_clients_ac5 = "Measuring childrens' growth length - referral required";
            public const string child_clients_ac6 = "Measuring children's growth weight";
            public const string child_clients_ac7 = "Measuring childrens' growth weight - referral not required";
            public const string child_clients_ac8 = "Measuring childrens' growth weight - referral required";
            public const string child_clients_ac9 = "Measuring children's growth MUAC";
            public const string child_clients_ac10 = "Measuring childrens' growth MUAC - referral not required";
            public const string child_clients_ac11 = "Measuring childrens' growth MUAC - referral required";
            public const string child_clients_ac12 = "Vitamin A";
            public const string child_clients_ac13 = "Deworming";
            public const string child_clients_ac14 = "Immunisations";


            public const string SSChild = "Child";
            public const string child_data_collection = "Child Data Collection";
            public const string child_data_collection_ac1 = "Child Registration Completed";
            public const string child_data_collection_ac2 = "Child Registration Removed";
            public const string child_data_collection_ac3 = "Attendance submitted for practitioner's/principal's class";

            public const string income_statement = "Submission of income statement";

            public const string income_statement_ac1 = "Add/Edit monthly preschool fee";
            public const string income_statement_ac2 = "Preschool fees added to income statement";
            public const string income_statement_ac3 = "Monthly income statement submitted by the deadline";
            public const string income_statement_ac4 = "Practitioner submits 3 consecutive months' income statements";

            public const int monthly_points_max_practitioner = 100;
            public const int monthly_points_max_principal_or_admin = 150;
        }

        public static class PointsActivityConstants
        {
            public static readonly Guid ChildAttendanceRegisterSavedId = new Guid("af31301f-2791-438f-8341-d605af9b4616");
            public static readonly Guid ChildRegistrationCompleteId = new Guid("a012de24-582e-4631-9612-c847c9d166b1");
            public static readonly Guid ChildRemovedFromPreschoolId = new Guid("ecff0efb-441d-4075-8ca4-82c0545d64e0");
            public static readonly Guid ThemePlannedId = new Guid("b16ca985-7b54-4968-9e43-d08e301f438b");
            public static readonly Guid NoThemePlannedId = new Guid("d0f30701-24c6-4a92-ab23-7db49edb9452");
            public static readonly Guid AddNewPractitionerToPreschoolId = new Guid("9bf3b569-7518-47a2-9219-38d4040f2c72");
            public static readonly Guid AddNewClassToPreschoolId = new Guid("1f0e6a37-62f8-4f1b-af82-4b3311c895c6");
            public static readonly Guid DownloadIncomeStatementId = new Guid("8a6f8457-3cda-4b3f-b32a-0d2e3694069e");
            public static readonly Guid AddExpenseOrIncomeToStatementId = new Guid("1be2ffb2-b119-4c9c-9991-6ec4e9686db8");
            public static readonly Guid PreschoolFeesGreaterThan0ForEachChildId = new Guid("913871dd-0199-427e-8158-d1453bbbd568");
            public static readonly Guid CompleteChildProgressObservationsId = new Guid("959dbdce-6264-4bef-9d47-5d75e284162c");
            public static readonly Guid CreateChildProgressReportId = new Guid("0ae80716-6355-432f-8680-5df42c6ea677");
            public static readonly Guid DownloadPreschoolOrClassProgressSummaryId = new Guid("a320a46f-3e00-4a8e-b7c7-f09629ed5d07");
            public static readonly Guid CompleteOnlineTrainingCourseId = new Guid("a6090402-766c-4298-a47d-3f4329276ca1");
            public static readonly Guid AddingShortDescriptionId = new Guid("06edbd89-60ca-409d-a65d-a8fc6283cc53");
            public static readonly Guid CompleteCommunityProfileId = new Guid("affdd04f-85bc-4bb3-b123-e9a80bcbd56e");
            public static readonly Guid ConnectWithAnotherUserId = new Guid("87da9e98-c977-4a72-9da0-9e3df7932c4b");

            public static readonly string PreschoolFeeId = "3915acb0-db44-a323-c086-fe3376d2bfd4";
        }

        public static class WorkflowStatus
        {
            public static readonly Guid ActiveId = new Guid("9c63bce4-7864-4c32-95ea-736ec6564204");
        }

        public static class MaxPointsTotal
        {
            public const int PrincipalMaxMonthPoints = 295;
            public const int PrincipalMaxYearPoints = 6025;
            public const int PractitionerMaxMonthPoints = 220;
            public const int PractitionerMaxYearPoints = 2905;

            public const int NoPermissionPractitionerMaxMonthPoints = 20;
            public const int NoPermissionPractitionerMaxYearPoints = 380;
            public const int PermissionPractitionerMaxMonthPoints = 130;
            public const int PermissionPractitionerMaxYearPoints = 1420;


        }

        public static class PractitionerPermissions
        {
            public static readonly string TakeAttendance = "take_attendance";
            public static readonly string CreateProgressReports = "create_progress_reports";
            public static readonly string ManageChildren = "manage_children";
            public static readonly string PlanClassroomActivities = "plan_classroom_activities";
        }
        
        public static class StatusColours
        {
            public static readonly string Green = MetricsColorEnum.Success.ToString();
            public static readonly string Amber = MetricsColorEnum.Warning.ToString();
            public static readonly string Red = MetricsColorEnum.Error.ToString();
            public static readonly string None = MetricsColorEnum.None.ToString();
        }
        public static class PortalSettings
        {
            public const string visit_high_activity = "High activity (at least 20 visits in past month)";
            public const string visit_medium_activity = "Medium activity (at least 10 visits in past month)";
            public const string visit_low_activity = "Low activity (no home visits in the past month)";

            public const string usage_invitation_active = "Invitation active";
            public const string usage_invitation_expired = "Invitation expired";
            public const string usage_last_online_past_6_months = "Last online within past 6 months";
            public const string usage_last_online_over_6_months = "Last online over 6 months ago";
            public const string usage_removed = "Removed (users who have been removed from the app)";
            public const string sms_failed_authentication = "SMS failed - authentication";
            public const string sms_failed_connection = "SMS failed - connection";
            public const string sms_failed_insufficient_credits = "SMS failed - insufficient credits";
            public const string sms_failed_opted_out = "SMS failed - blocked/opted out";

            public const string usage_green = "successMain";
            public const string usage_orange = "alertMain";
            public const string usage_red = "errorMain";
            public const string usage_blue = "infoMain";
        }

        public static class CSSColorClasses
        {
            public const string Green = "successMain";
            public const string Orange = "alertMain";
            public const string Red = "errorMain";
            public const string Blue = "infoMain";
        }

        public static class ResourceLikes
        {
            public const string Zero = "0 likes";
            public const string OneToTen = "1 to 10 likes";
            public const string ElevenToFifty = "11 to 50 likes";
            public const string FiftyOneToHundred = "51 to 100 likes";
            public const string MoreThanHundred = "More than 100 likes";
        }

        public static class PermissionNames 
        {
            public const string  NanageChildren = "manage_children";
            public const string  TakeAttendance = "take_attendance";
            public const string  CreateProgressReports = "create_progress_reports";
            public const string  PlanClassroomActivities = "plan_classroom_activities";
        }
    }
}

