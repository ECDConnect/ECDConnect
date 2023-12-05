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
            public const string client_trainee = "trainee";
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

            public const string visitType_smart_space_checklist = "smart_space_checklist";
            public const string visitType_startup_support_agreement = "startup_support_agreement";
            public const string visitType_self_assessment = "self_assessment";

            public const string visitType_trainee_visit = "trainee_visit";
            public const string visitType_practitioner_visit = "practitioner_visit";
            public const string visitType_practitioner_call = "practitioner_call";
            public const string visitType_coach_franchisee_agreement = "franchisee_agreement";

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
            public const string step2_q2_a2 = "1 - Children were usually supervised (unsupervised 2 times or less in a session).";
            public const string step2_q2_a3 = "2 - The space was divided into 3 or more interest areas.";

            public const string step2_q3 = "Using the toy kit";
            public const string step2_q3_a1 = "0 - The play kit was not unpacked into the learning space.";
            public const string step2_q3_a2 = "1 - Children were usually supervised (unsupervised 2 times or less in a session).";
            public const string step2_q3_a3 = "2 - The play kit was unpacked and the materials were available for children's play for more than 40 mins of the session.";

            public const string step2_q4 = "Labelling (symbols or words)";
            public const string step2_q4_a1 = "0 - Interest areas and materials were not labelled.";
            public const string step2_q4_a2 = "1 - Children were usually supervised (unsupervised 2 times or less in a session).";
            public const string step2_q4_a3 = "2 - All interest areas and play materials were labelled.";

            public const string step2_q5 = "Toys & storybooks";
            public const string step2_q5_a1 = "0 - Toys and storybooks were kept out of children's reach.";
            public const string step2_q5_a2 = "1 - Children were usually supervised (unsupervised 2 times or less in a session).";
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
            public const string step12_q1_a8 = "There is open water (where children could fall and drown).";
            public const string step12_q1_a9 = "There are no exposed electrical wires or electric sockets that children can reach.";
            public const string step12_q1_a10 = "There is no smoking or open fires in the venue.";
            public const string step12_q1_a11 = "There are not heights or steps from which children could fall.";
            public const string step12_q1_a12 = "No dangerous animals can approach the venue.";
            public const string step12_q1_a13 = "If children use an outdoor area, it is clean, with no litter or animal faeces.";
            public const string step12_q1_a14 = "The venue is in an area that is known as a safe place in the community.";
            public const string step12_q1_a15 = "There is at minimum a bucket of sand available in case of fires or the fire blanket or extinguisher.";
            public const string step12_q1_a16 = "There is a basic first aid kit in case of accidents.";
            public const string step12_q1_a17 = "There is an emergency plan displayed on the wall (can use one from Start pack).";

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
            public const string step8_re_accreditation_a4 = "Displays: the learning space is interesting with posters and children’s work on the walls.";
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
            public const string step_10_re_accreditation_q8 = "Adults join in as a partner in children’s play, encourage children to talk about what they are doing, and use comments and questions to help children learn.";
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
        }
        public static class GGSettings
        {
            public const int recordsPerPage = 40;
            public const int pageNumber = 0;
            public const string visitType_all = "all";
            public const string visitType_overdue = "overdue";
            public const string visitType_due = "due";
            public const string visit_follow_up = "Follow up";
            public const string client_mother = "mother";
            public const string client_child = "child";
            public const string client_new = "New client";
            public const string client_teenager = "Teenager";
            public const string client_pregnant_mom = "Pregnant mom";
            public const string client_pregnant_mom_and_child = "Pregnant mom and child";
            public const string client_pregnant_mom_multiple_children = "Multiple children";
            public const string maternal_record_name = "maternalcaserecord.png";
            public const string upload_maternal_case_record = "Upload maternal case record";
            public const string additional_visits = "additional_visits";
            public const string visit1 = "visit_1";
            public const string visit2 = "visit_2";
            public const string visit3 = "visit_3";
            public const string visit4 = "visit_4";
            public const string visit_data_client_dashboard = "ClientDashboard";
            public const string visit_data_client_summary = "ClientSummary";
            public const string visit_data_client_referral = "Referral";
            public const string visit_data_client_progress = "Progress";

            // Mother Questions
            public const string q_first_antenatal_visit = "Has {client} gone to the clinic for her first antenatal visit?";
            public const string q_antenatal_visits = "Is {client} up to date with their antenatal clinic visits?";
            public const string q_measurement = "What is {client} mid-upper arm circumference (MUAC) today?";
            public const string q_danger_signs = "Tick the danger signs {client} is experiencing:";
            public const string q_stop_worry = "Felt unable to stop worrying or thinking too much?";
            public const string q_felt_down = "Felt down, depressed or hopeless?";
            public const string q_suicide = "Had thoughts and plans to harm yourself or commit suicide?";
            public const string q_T = "(T) Tolerance: how many drinks does it take to make you high?";
            public const string q_A = "(A) Have people annoyed you by criticizing your drinking?";
            public const string q_C = "(C) Have you ever felt you need to cut down on your drinking?";
            public const string q_E = "(E) Eye-opener: have you ever had a drink the first thing in the morning to steady your nerves or get rid of a hangover?";

            public const string q_ID_doc = "Does {client} have an ID document?";
            public const string q_citizen = "Is {client} a South African citizen or permanent resident?";

            // Mother referral, progress, G4 (ClientDashboardAlert), G9 (ClientSummaryDownload)
            public const string pregnancy_not_booked = "Pregnancy not booked";
            public const string pregnancy_booked = "Pregnancy booked";
            public const string refer_to_clinic = "Refer to clinic";
            public const string refer_to_clinic_urgently = "Refer to clinic urgently";
            public const string clinic_visits_not_up_to_date = "Clinic visits not up to date";
            public const string clinic_visits_up_to_date = "Clinic visits up to date";
            public const string clinic_visits_up_to_date_2 = "You are up to date with your clinic visits!";
            public const string clinic_referrals = "Clinic referrals";
            public const string home_affairs_referrals = "Department of Home Affairs referrals";
            public const string sassa_refferals = "Refer to SASSA";
            public const string missed_clinic_visit = "You missed a clinic visit - make sure you go as soon as possible!";
            public const string all_clinic_visit = "You are up to date with your clinic visits!";
            public const string underweight = "May be underweight - MUAC less than 22cm";
            public const string underweight2 = "You might be underweight: eat 3 meals every day";
            public const string underweight3 = "Underweight";
            public const string overweight = "Overweight";
            public const string obese = "Obese";
            public const string muac_over_22 = "MUAC over 22cm";
            public const string healthy_weight = "According to your mid-upper arm circumference, you are a healthy weight";
            public const string urgent_care = "You need urgent care for some serious health issues";
            public const string no_danger_signs = "No danger signs for ";
            public const string danger_signs = "Danger signs";
            public const string physical_feeling_well = "You are feeling physically well";
            public const string maternal_distress = " was experiencing maternal distress";
            public const string maternal_distress2 = "Maternal distress";
            public const string need_support = "You are struggling and need some support";
            public const string was_coping = " was coping well";
            public const string coping_well = "You are coping well!";
            public const string was_experiencing = " was experiencing: ";
            public const string t_ace_score = " is at risk of a drinking problem (T-ACE score = ";
            public const string support_drinking = "You may need support to reduce your drinking";
            public const string no_alcohol_abuse = " is not at risk for alcohol abuse";
            public const string no_id_book = " doesn't have an ID book";
            public const string id_book = " has an ID book";
            public const string go_to_home_affairs = "Go to Home Affairs to apply for your ID book.  This will allow you to apply for the child social grant as soon as the baby is born.";
            public const string apply_social_grant = "You have your ID document & can apply for a child social grant once the baby is born!";
            public const string growth_referral = " is not growing well: ";
            public const string not_growing = " is not growing well";
            public const string growing_well = " is growing well";
            public const string health_issues = "You have some health issues";
            public const string severely_underweight = "Severely underweight";
            public const string severely_stunted = "Severely stunted";
            public const string stunted = "Stunted";
            public const string severe_acute_malnutrition = "Severe acute malnutrition";
            public const string moderate_acute_malnutrition = "Moderate acute malnutrition";
            public const string growth_faltering = "Growth faltering: weight has not increased ";
            public const string great_job_breastfeeding = "You're doing a great job breastfeeding!";
            public const string great_job_formula_feeding = "You're doing a great job formula feeding!";
            public const string try_to_make_sure = "Try to make sure you give ";
            public const string only_milk = " only breast milk or only formula milk";
            public const string poor_dietary_diversity = "Poor dietary diversity: {x} out of {y} food groups";
            public const string give_client_food = "You are giving {client} foods from {x} out of {y} groups. Try to give {client} a variety of foods!";
            public const string good_dietary_diversity = "Good dietary diversity: {x} out of {y} food groups!";
            public const string give_client_food_most = "You are giving {client} foods from most of the groups!";
            public const string dev_is_struggling = "{client} is struggling with ";
            public const string dev_might_struggling = "{client} might be having issues with: ";
            public const string immunisations_not_up_to_date = "Immunisations not up to date";
            public const string vitamin_not_up_to_date = "Vitamin A not up to date";
            public const string deworming_not_up_to_date = "Deworming not up to date";
            public const string not_up_to_date = "Immunisations, deworming and Vitamin A not up to date";
            public const string missed_immunisations = "{client} missed an immunisation, deworming and Vitamin A supplement";
            public const string all_up_to_date = "All immunisations, Vitamin A and deworming are up to date";
            public const string all_up_to_date_client = "All of {client}'s immunisations are up to date";
            public const string physical_well = " is doing well physically";
            public const string no_birth_certificate = " does not have a birth certificate";
            public const string has_birth_certificate = "Has applied for a birth certificate";
            public const string has_csg = "Has applied for a child support grant";
            public const string has_csg2 = "You applied for the child support grant - this will support {client}'s healthy growth!";
            public const string has_csg3 = "Has not applied for a child support grant";

            // Infant Questions
            public const string q_postnatal_check_up = "Has {client} been to the clinic for a postnatal check-up?";
            public const string q_postnatal_6_weeks = "Did your client attend her 6-week postnatal clinic visit?";
            public const string q_weight = "Weight";
            public const string q_length = "Length";
            public const string q_muac = "What is {client} MUAC today?";
            public const string q_eat_drink = "What did {client} eat or drink in the last 24 hours?";
            public const string q_eat_drink_nutrition = "What did you give {client} to eat or drink in the last 24 hours?";
            public const string q_breastfeeding_club = "Would you like to join a breastfeeding club?";
            public const string q_mixed_foods = "Which of these foods have you given {client}?  You can choose more than one.";
            public const string q_check_can_do = "Check what {client} can do:";

            public const string q_hearing1 = "Gets a fright when they hear a loud sound";
            public const string q_hearing2 = "Moves eyes or head in direction of sounds";
            public const string q_hearing3 = "Responds by making sounds when talked to";
            public const string q_hearing4 = "Babbles (ma-ma. da-daa)";
            public const string q_hearing5 = "Turns when called";
            public const string q_hearing6 = "Uses simple gestures (lifts arms to be picked up)";
            public const string q_hearing7 = "Has one meaningful word (dada. mama) although it may not be clear";
            public const string q_hearing8 = "Understands names of at least 2 common objects (cup)";
            public const string q_hearing9 = "Uses at least 3 words";

            public const string q_seeing1 = "Follows faces or close objects with their eyes";
            public const string q_seeing2 = "Follows faces or close objects with his/her eyes";
            public const string q_seeing3 = "Eyes move well together (no squinting). recognises familiar faces and looks at own hands";
            public const string q_seeing4 = "Eyes focus on far objects?";
            public const string q_seeing5 = "Looks for toys/objects that disappear";
            public const string q_seeing6 = "Looks closely at toys/objects and pictures";
            public const string q_seeing7 = "Looks at small shapes clearly at a distance";

            public const string q_brain1 = "Smiles at people";
            public const string q_brain2 = "Laughs out loud";
            public const string q_brain3 = "Uses different cries or sounds to show hunger. tiredness or discomfort?";
            public const string q_brain4 = "Throws. bangs toys/objects";
            public const string q_brain5 = "React when caregiver leaves and calms when they return";
            public const string q_brain6 = "Imitates gestures (clapping hands)";
            public const string q_brain7 = "Follows simple commands";

            public const string q_moving1 = "Holds up their head upright when held against shoulder";
            public const string q_moving2 = "Grabs toys in each hand";
            public const string q_moving3 = "Lifts their head when lying on their tummy";
            public const string q_moving4 = "Moves objects from hand to hand";
            public const string q_moving5 = "Sits without support";
            public const string q_moving6 = "Walks alone";
            public const string q_moving7 = "Uses fingers to feed themselves";

            public const string q_immunisation = "Did the baby have the {age} immunisation?";
            public const string q_vitamin_a = "Is Vitamin A up to date?";
            public const string q_deworming = "Is deworming up to date?";
            public const string q_birth_certificate = "Does {client} have a birth certificate?";
            public const string q_csg_receiving = "Is {client} receiving the CSG?";
            public const string q_csg_applied = "Has {client} applied for a CSG?";
            public const string q_csg_qualify = "Does {client} qualify for CSG?";

            public const string cfm_name = "Care for mom";
            public const string cfb_name = "Care for baby";
            public const string p4_name = "Pillar 4: Healthcare";
            public const string low_birth_weight = "Low birth weight";

            // Infant referral, progress, G4 (ClientDashboardAlert), G9 (ClientSummaryDownload)
            public const string infant_missed_clinic_visit = "Missed clinic visit";
            public const string infant_missed_clinic_visit_g9 = "You missed a clinic visit - make sure you go as soon as possible!";

            public const string infant_clinic_visit = "Up to date with clinic visits";
            public const string infant_clinic_visit_g9 = "You are up to date with clinic visits";

            public const string cfm_ds_1 = "Not feeling physically well";
            public const string cfm_ds_2 = "Abdominal pain";
            public const string cfm_ds_3 = "Heavy bleeding";
            public const string cfm_ds_4 = "Feeling too hot or too cold";
            public const string cfm_ds_5 = "Offensive or bad-smelling vaginal fluid";
            public const string cfm_ds_6 = "Unable to manage the baby";
            public const string cfm_ds_7 = "High stress";
            public const string cfm_ds_8 = "Problems with breastfeeding";

            public const string cfb_ds_1 = "Blue skin colour";
            public const string cfb_ds_2 = "Baby is not alert";
            public const string cfb_ds_3 = "Fast breathing or difficulty breathing";
            public const string cfb_ds_4 = "Poor feeding or repeated vomiting";
            public const string cfb_ds_5 = "Low (below 35 degrees C) or high temperature";
            public const string cfb_ds_6 = "Yellow skin or eyes";
            public const string cfb_ds_7 = "Severe eye infection";
            public const string cfb_ds_8 = "Severe cord infection";

            public const string p4_ds_1 = "Not moving or does not wake up";
            public const string p4_ds_2 = "Shaking (convulsions)";
            public const string p4_ds_3 = "Diarrhoea, sunken eyes and a sunken fontanelle";
            public const string p4_ds_4 = "Coughing and breathing fast (more than 50 breaths per minute)";
            public const string p4_ds_5 = "Signs of malnutrition (swollen ankles and feet)";
            public const string p4_ds_6 = "Vomiting everything";
            public const string p4_ds_7 = "Fever and not feeding";
            public const string p4_ds_8 = "Unable to breastfeed";

            public const string p1_1 = "Breast milk";
            public const string p1_2 = "Starch";
            public const string p1_3 = "Nuts, beans, peas, lentils";
            public const string p1_4 = "Dairy";
            public const string p1_5 = "Meat";
            public const string p1_6 = "Eggs";
            public const string p1_7 = "Vitamin A rich fruit & vegetables";
            public const string p1_8 = "Other fruits & vegetables";

            // Answers
            public const string answer_yes = "true";
            public const string answer_no = "false";
            public const string none_above = "None of the above";
            public const string normal_risk = "normal";
            public const string more_than_2 = "More than 2";
            public const string male = "Male";
            public const string female = "Female";
            public const string growth_section = "Growth";
            public const string breast_milk_only = "Breast milk only";
            public const string formula_milk_only = "Formula milk only";
            public const string mixed_feeding = "Mixed feeding";
            public const string normal_comment = "Normal";

            // Growth names
            public const string weightForAgeBoys = "weight-for-age-boys";
            public const string weightForAgeGirls = "weight-for-age-girls";
            public const string weightForLengthGirls = "weight-for-length-girls";
            public const string weightForLengthBoys = "weight-for-length-boys";
            public const string weightForHeightGirls = "weight-for-height-girls";
            public const string weightForHeightBoys = "weight-for-height-boys";

            public const string lengthHeightForAgeGirls = "length-height-for-age-girls";
            public const string lengthHeightForAgeBoys = "length-height-for-age-boys";

            // Visit names
            public const string careForMom = "Care for mom";
            public const string careForBaby = "Care for baby";

            public const string pillar1_report = "Nutrition";
            public const string pillar1_db = "Pillar 1: Nutrition";

            public const string pillar2_report = "Love, talk and play";
            public const string pillar2_db = "Pillar 2: Love, talk and play";

            public const string pillar3_report = "Protection";
            public const string pillar3_db = "Pillar 3: Protection";
            public const string pillar3_section = "Immunisations, supplements & deworming";

            public const string pillar4_report = "Healthcare";
            public const string pillar4_db = "Pillar 4: Healthcare";

            public const string pillar5_report = "Extra care";
            public const string pillar5_db = "Pillar 5: Extra care";

            public const string antenatalCare = "Antenatal care";
            public const string nutrition = "Nutrition";
            public const string pregnancyCare = "Pregnancy care";
            public const string dangerSigns = "Danger signs";

            public const string doingWell = "You are doing well in these areas:";
            public const string needSupport = "You need support in these areas:";
            public const string needUrgentSupport = "You need urgent support with these areas:";

            public const string idDocSection = "ID document";

            // Infant Dates
            public const string day_3 = "day_3";
            public const string day_7 = "day_7";
            public const string week_2 = "week_2";
            public const string week_4 = "week_4";
            public const string week_7_to_8 = "week_7_to_8";
            public const string months_3 = "3_months";
            public const string months_4 = "4_months";
            public const string months_5 = "5_months";
            public const string months_6 = "6_months";
            public const string months_9 = "9_months";
            public const string months_12 = "12_months";
            public const string months_15 = "15_months";
            public const string months_18 = "18_months";
            public const string months_21 = "21_months";
            public const string months_24 = "24_months";
            public const string years_5 = "5_years";

            //record events
            public const string caregiverIsPregnant = "caregiver_is_pregnant";
            public const string newChildInFamily = "new_child_in_family";
            public const string caregiverHasChanged = "caregiver_has_changed";

            //sections
            public const string maternal_distress_screening = "Maternal distress screening";
            public const string mother_growth = "Mother growth monitoring (Mid-upper arm circumference)";
            public const string alcohol_use = "Alcohol use";
            public const string child_docs = "Child documentation";
            public const string child_road_to_health = "Road to Health Book";
        }

        public static class SSIntegrationSettings
        {
            //Franchisee Queries
            public const string SSPractitioner = "Practitioner";
            public const string SLPractitioner = "Franchisee";
            public const string SLPractitionerQueryAll = SLPractitioner + QueryAll;
            public const string SLPractitionerQueryByGuid = SLPractitioner + QueryByGuid;
            public const string SLPractitionerUpdate = SLPractitioner + UpdateSingular;
            //Coach Queries
            public const string SSCoach = "Coach";
            public const string SLCoach = "Coach";
            //Franchisor Queries
            public const string SSFranchisor = "Franchisor";
            public const string SLFranchisor = "Franchisor";
            //Child Queries
            public const string SSChild = "Child";
            public const string SLChild = "Child";
            //Caregiver Queries
            public const string SSCaregiver = "Caregiver";
            public const string SLCaregiver = "Caregiver";
            //Trainee Queries
            public const string SSTrainee = "Trainee";
            public const string SLTrainee = "Trainee";
            //Address Queries
            public const string SSAddress = "SiteAddress";
            public const string SLAddress = "Address";
            //Record Queries
            public const string SSRecordChange = "";
            public const string SLRecordChange = "RecordChange";
            //Column Queries
            public const string SSColumnChange = "";
            public const string SLColumnChange = "ColumnChange";
            //Document Queries
            public const string SSDocument = "Document";
            public const string SLDocument = "Document";
            //DocumentType Queries
            public const string SSDocumentType = "DocumentType";
            public const string SLDocumentType = "DocumentType";
            //IncomeStatement Queries
            public const string SSIncomeStatementIncome = "StatementsIncome";
            public const string SLIncomeStatementIncome = "IncomeStatement";
            public const string SSIncomeStatementExpense = "StatementsExpense";
            public const string SLIncomeStatementExpense = "IncomeStatement";
            //ChildAttendanceRegister Queries
            public const string SSChildAttendanceRegister = "Attendance";
            public const string SLChildAttendanceRegister = "ChildAttendanceRegister";
            //Note Queries
            public const string SSNote = "Note";
            public const string SLNote = "Note";
            //Club data Queries
            public const string SSClub = "Club";
            public const string SLClub = "Club";
            public const string SSClubMeeting = "ClubMeeting";
            public const string SLClubMeeting = "ClubMeeting";
            public const string SSClubMeetingRegister = "ClubMeetingRegister";
            public const string SLClubMeetingRegister = "ClubMeetingRegister";
            //PQA
            public const string SSPQA = "PQA";
            public const string SLPQA = "PQA";
            //SmartSpaceVisits
            public const string SSSmartSpaceVisit = "SmartSpaceVisit";
            public const string SLSmartSpaceVisit = "SmartSpaceVisit";

            //Additional API Switches
            public const string QueryAll = "/Query";
            public const string Singular = "/{{Guid}}";
            public const string QueryByGuid = "/Query/{{Guid}}";
            public const string ColumnsMetadata = "/Columns";
            public const string UpdateMultiple = "/Multiple";
            public const string UpdateSingular = "/{{Guid}}";
            public const string CreateMultiple = "/Multiple";
            public const string CreateSingular = "/";
            public const string DocumentSendLength = "20";
            public const string IntegrationSystem = "Smartlink";

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

        }

        public static class CoachingCircleSettings
        {
            public const string no_circle_meetings_held = "No coaching circles held yet ";
            public const string circle_meetings_held = "Last coaching circle held: ";

            public const string meeting_type_coach_circle = "coaching_circle";
        }
        public static class ClubSettings
        {
            public const string meeting_type_club_meeting = "club_meeting";
            public const string meeting_type_play_day = "play_day";
            public const string meeting_type_story_day = "story_day";
            public const string meeting_type_end_of_year_celebration = "end_of_year_celebration";
            public const string meeting_type_open_day = "open_day";
            public const string meeting_type_caregiver_meeting = "caregiver_meeting";
            public const string meeting_type_other = "other";

            public const string no_club_leader = "No club leader";
            public const string contact_club_leader = "Contact club leader";
            public const string contact_club_leader_name = "Contact ";
            public const string choose_club_leader = "Choose a new club leader";
            public const string assign_club_leader = "Assign club leader";
            public const string not_accepted_club_leader = "Club leader has not accepted agreement";
            public const string not_enough_club_members = "Not enough club members";
            public const string contact_club_members = "Contact club members";
            public const string add_members = "Add members";
            public const string too_many_club_members = "Too many club members";
            public const string create_club = "Create an additional club";
            public const string club_leader_months = " has been a club leader for 6 or more months";
            public const string missing_register = "Missing club meeting register";
            public const string missing_register_for_month = " club meeting register";
            public const string club_attendance = "% club attendance in ";
            public const string new_club = "New club";
            public const string name_purple = "Purple";
            public const string club_purple = "Purple club";
            public const string club_not_in_league = "Club not in league";
            public const string name_new_stars = "New Stars";
            public const string name_rising_stars = "Rising Stars";
            public const string top_of_the_league = "Top of the league";
            public const string points_earned = " points earned in ";
            public const int purple_club_max_points = 2200;
            public const int non_purple_club_max_points = 2000;

            public const string leave_no_one_behind = "Leave no one behind";
            public const string host_family_days = "Host family days";
            public const string child_progress_reports = "Complete child progress reports";
            public const string capture_child_attendance = "Capture child attendance";
            public const string meet_regularly = "Meet regularly";
            public const string be_creative = "Be creative";
            public const string sub_caregiver_meeting = "Caregiver meeting";
            public const string sub_progress_tracking = "Progress tracking";

            public const string document_success = "Image completed";
            public const string document_no_success = "Image incompleted";

            public static readonly int[] allowed_months = { 4,5,6,7,8,9,10,11 };

            public const int warning_start_800 = 1;
            public const int warning_end_800 = 599;

            public const int success_start_800 = 600;
            public const int success_end_800 = 800;

            public const string workflow_upload_type = "Document";
            public const string workflow_status_upload_type = "Verified";
            public const string activity_upload_type = "ClubActivityUpload";

            public const string upload_type_be_creative = "BeCreative";
            public const string upload_type_family_days = "FamilyDays";

            public const string first_reporting_period = "\"reportingPeriod\":\"First\"";

        }

    }
}

