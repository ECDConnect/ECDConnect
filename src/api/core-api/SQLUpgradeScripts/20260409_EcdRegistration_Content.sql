-- =============================================
-- 1. Create new ContentTypeFields (run once)
-- =============================================
/*INSERT INTO public."ContentTypeField"
("Id", "FieldOrder", "FieldName", "FieldTypeId", "IsActive", "DataLinkName", "ContentTypeId", 
 "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "DisplayName", "DisplayMainTable", "DisplayPage", "IsRequired")
VALUES
(nextval('public."ContentTypeField_Id_seq"'), 31, 'buttonlinkA',            1, true, '', 15, current_date, current_date, NULL, NULL, 'Button Link A', true, true, true),
(nextval('public."ContentTypeField_Id_seq"'), 32, 'buttonlinkADescription', 1, true, '', 15, current_date, current_date, NULL, NULL, 'Button Link A Description', true, true, true),
(nextval('public."ContentTypeField_Id_seq"'), 33, 'buttonlinkB',            1, true, '', 15, current_date, current_date, NULL, NULL, 'Button Link B', true, true, true),
(nextval('public."ContentTypeField_Id_seq"'), 34, 'buttonlinkBDescription', 1, true, '', 15, current_date, current_date, NULL, NULL, 'Button Link B Description', true, true, true),
(nextval('public."ContentTypeField_Id_seq"'), 35, 'buttonlinkC',            1, true, '', 15, current_date, current_date, NULL, NULL, 'Button Link C', true, true, true),
(nextval('public."ContentTypeField_Id_seq"'), 36, 'buttonlinkCDescription', 1, true, '', 15, current_date, current_date, NULL, NULL, 'Button Link C Description', true, true, true),
(nextval('public."ContentTypeField_Id_seq"'), 37, 'infoBoxBTitle',          1, true, '', 15, current_date, current_date, NULL, NULL, 'Info Box B Title', true, true, true),
(nextval('public."ContentTypeField_Id_seq"'), 38, 'infoBoxBDescription',    2, true, '', 15, current_date, current_date, NULL, NULL, 'Info Box B Description', true, true, true),
(nextval('public."ContentTypeField_Id_seq"'), 39, 'infoBoxBLink',           1, true, '', 15, current_date, current_date, NULL, NULL, 'Info Box B Link', true, true, true),
(nextval('public."ContentTypeField_Id_seq"'), 40, 'infoBoxBLinkDescription',1, true, '', 15, current_date, current_date, NULL, NULL, 'Info Box B Link Description', true, true, true);
*/
-- =============================================
-- 2. Main script with JSON translations
-- =============================================
DO $$
DECLARE
    tenant_ids TEXT[] := ARRAY[
        '258a15e6-3736-45ea-875c-48d9377de4c8',
        'e8f571eb-1972-4e71-a20f-347c65d059bb'
    ];

    tenant_id TEXT;
    content_id_apply integer;
    content_id_comply integer;

    visit_field_id integer;
    type_field_id integer;
    section_field_id integer;
    infoBox_title_field_id integer;
    infoBox_description_field_id integer;
    headerA_field_id integer;
    descriptionA_field_id integer;
    buttonlinkA_field_id integer;
    buttonlinkADescription_field_id integer;
    headerB_field_id integer;
    descriptionB_field_id integer;
    buttonlinkB_field_id integer;
    buttonlinkBDescription_field_id integer;
    headerC_field_id integer;
    descriptionC_field_id integer;
    buttonlinkC_field_id integer;
    buttonlinkCDescription_field_id integer;
    infoBoxB_title_field_id integer;
    infoBoxB_description_field_id integer;
    infoBoxB_link_field_id integer;
    infoBoxB_link_description_field_id integer;
    siteAddress TEXT;
    practitionerProfilePath TEXT := '/practitioner-profile?tabIndex=1';
    availableLanguages_field_id integer;


    -- Locales (add more here when needed)
    locales TEXT[] := ARRAY['en', 'afr', 'zul', 'xho', 'nso', 'sot'];
    locale_en_id  TEXT := '9688cd08-adef-408c-9d34-5d75ae5c44df';
    locale_afr_id TEXT := '058b9d8e-e472-48d6-8415-ba9408b95395';
    locale_zul_id TEXT := '7cc62017-7ee7-4f2c-9214-bc9be3f2396a';    
    locale_xho_id TEXT := '03fff220-106f-4ff7-9e06-20c4ec439483';   
    locale_nso_id TEXT := '06370c67-692e-4664-a90a-c2de0621ff4d';  
    locale_sot_id TEXT := '0b86af94-d341-435a-b944-7a8c874c385a';

    -- Translations stored as JSONB
    apply_translations JSONB;
    comply_translations JSONB;

    current_locale TEXT;
    field_name TEXT;
    field_value TEXT;
    field_id INTEGER;

BEGIN
    -- ====================== DEFINE TRANSLATIONS ======================
    apply_translations := '{
    "visit": {
        "en": "Apply",
        "afr": "Aansoek doen",
        "zul": "Faka isicelo",
        "xho": "Faka isicelo",
        "nso": "Diriša kopo",
        "sot": "Etsa kopo"
    },
    "type": {
        "en": "Apply",
        "afr": "Apply",
        "zul": "Apply",
        "xho": "Apply",
        "nso": "Apply",
        "sot": "Apply"
    },
    "infoBoxTitle": {
        "en": "Remember: registration is free. If anyone asks you to pay, contact the DBE.",
        "afr": "Onthou: registrasie is gratis. As iemand jou vra om te betaal, kontak die DBE.",
        "zul": "Khumbula: ukubhalisa kumahhala. Uma umuntu ekucela ukuthi ukhokhe, xhumana ne-DBE.",
        "xho": "Khumbula: ukubhalisa simahla. Ukuba umntu ukucela ukuba uhlawule, qhagamshelana ne-DBE.",
        "nso": "Gopola: ngwadišo ke mahala. Ge motho a go kgopela go lefa, ikopanye le DBE.",
        "sot": "Hopola: ngoliso ke mahala. Haeba motho a u kopa ho lefa, ikopanye le DBE."
    },
    "headerA": {
        "en": "Step 1: Sign up for eCares",
        "afr": "Stap 1: Registreer vir eCares",
        "zul": "Isinyathelo 1: Bhalisa ku-eCares",
        "xho": "Inyathelo 1: Bhalisa kwi-eCares",
        "nso": "Kgato 1: Ngwadiša go eCares",
        "sot": "Mohato 1: Ngolisa ho eCares"
    },
    "descriptionA": {
        "en": "<p>The eCares system allows you to begin your application process.<br>If you have not registered for eCares yet, click the link below to register</p>",
        "afr": "<p>Die eCares-stelsel laat jou toe om jou aansoekproses te begin.<br>As jy nog nie vir eCares geregistreer het nie, klik die skakel hieronder om te registreer</p>",
        "zul": "<p>Uhlelo lwe-eCares lukuvumela ukuthi uqale inqubo yokufaka isicelo.<br>Uma ungakabhalisi ku-eCares, chofoza isixhumanisi ngezansi ukuze ubhalise</p>",
        "xho": "<p>Inkqubo ye-eCares ikuvumela ukuba uqale inkqubo yokufaka isicelo.<br>Ukuba awukabhalisi kwi-eCares, cofa ikhonkco elingezantsi ukuze ubhalise</p>",
        "nso": "<p>Tshepedišo ya eCares e go dumelela go thoma tšhilo ya kopo ya gago.<br>Ge o sa ngwadišwa go eCares, kgotla sekgokelo ka tlase gore o ngwadiše</p>",
        "sot": "<p>Sistimi ea eCares e u lumella ho qala ts''ebetso ea kopo ea hau.<br>Haeba u e-so ngolise ho eCares, tobetsa sehokelo se ka tlase ho ngolisa</p>"
    },
    "buttonlinkADescription": {
        "en": "Register for eCares",
        "afr": "Registreer vir eCares",
        "zul": "Bhalisa ku-eCares",
        "xho": "Bhalisa kwi-eCares",
        "nso": "Ngwadiša go eCares",
        "sot": "Ngolisa ho eCares"
    },
    "headerB": {
        "en": "Step 2: Gather and submit documents",
        "afr": "Stap 2: Versamel en dien dokumente in",
        "zul": "Isinyathelo 2: Qoqa futhi uthumele amadokhumenti",
        "xho": "Inyathelo 2: Qokelela kwaye ungenise amaxwebhu",
        "nso": "Kgato 2: Kgobokanya le go romela ditokomane",
        "sot": "Mohato 2: Bokella le ho kenya litokomane"
    },
    "descriptionB": {
        "en": "<p>Gather these documents: <ul><li>Certified copies of ID or passport for yourself and all staff</li><li>Fill in Form 30 for all staff members</li></ul></p>",
        "afr": "<p>Versamel hierdie dokumente: <ul><li>Gesertifiseerde afskrifte van ID of paspoort vir jouself en alle personeel</li><li>Vul Vorm 30 in vir alle personeellede</li></ul></p>",
        "zul": "<p>Qoqa la madokhumenti: <ul><li>Amakhophi aqinisekisiwe we-ID noma ipasipoti yakho nawo wonke abasebenzi</li><li>Gcwalisa Ifomu 30 kuwo wonke amalungu abasebenzi</li></ul></p>",
        "xho": "<p>Qokelela la maxwebhu: <ul><li>Iikopi eziqinisekisiweyo ze-ID okanye ipasipoti yakho nabo bonke abasebenzi</li><li>Gcwalisa Ifom 30 kubo bonke abasebenzi</li></ul></p>",
        "nso": "<p>Kgobokanya ditokomane tše: <ul><li>Dikhopi tšeo di netefaditšwego tša ID le pasepoto ya gago le badiri ka moka</li><li>Tlatša Foromo 30 go badiri ka moka</li></ul></p>",
        "sot": "<p>Bokella litokomane tsena: <ul><li>Likopi tse netefalitsoeng tsa ID kapa pasepoto ea hau le basebetsi bohle</li><li>Tlatsa Foromo 30 ho basebetsi bohle</li></ul></p>"
    },
    "buttonlinkBDescription": {
        "en": "Download Form 30",
        "afr": "Laai Vorm 30 af",
        "zul": "Landa Ifomu 30",
        "xho": "Khuphela Ifom 30",
        "nso": "Laolla Foromo 30",
        "sot": "Jarolla Foromo 30"
    },
    "headerC": {
        "en": "Step 3: Get your Bronze certificate",
        "afr": "Stap 3: Kry jou Brons-sertifikaat",
        "zul": "Isinyathelo 3: Thola isitifiketi sakho seBronze",
        "xho": "Inyathelo 3: Fumana isatifikethi sakho seBronze",
        "nso": "Kgato 3: Fihlela setifikheiti sa gago sa Bronze",
        "sot": "Mohato 3: Fumana setifikeiti sa hau sa Bronze"
    },
    "descriptionC": {
        "en": "<p>Log in to eCares and fill in all of the information about your ECD programme.<br>Upload your documents.</p>",
        "afr": "<p>Meld aan by eCares en vul al die inligting in oor jou ECD-program.<br>Laai jou dokumente op.</p>",
        "zul": "<p>Ngena ku-eCares futhi gcwalisa yonke imininingwane mayelana nohlelo lwakho lwe-ECD.<br>Layisha amadokhumenti akho.</p>",
        "xho": "<p>Ngena kwi-eCares uze ugcwalise lonke ulwazi malunga nenkqubo yakho ye-ECD.<br>Layisha amaxwebhu akho.</p>",
        "nso": "<p>Ngwadiša go eCares gomme o tlatše tshedimošo ka moka mabapi le lenaneo la gago la ECD.<br>Laolla ditokomane tša gago.</p>",
        "sot": "<p>Ngola ho eCares ''me u tlatsa lintlha tsohle mabapi le lenaneo la hau la ECD.<br>Kenya litokomane tsa hau.</p>"
    },
    "buttonlinkCDescription": {
        "en": "Log in to eCares",
        "afr": "Meld aan by eCares",
        "zul": "Ngena ku-eCares",
        "xho": "Ngena kwi-eCares",
        "nso": "Ngwadiša go eCares",
        "sot": "Ngola ho eCares"
    },
    "infoBoxBTitle": {
        "en": "Need help?",
        "afr": "Het jy hulp nodig?",
        "zul": "Udinga usizo?",
        "xho": "Ufuna uncedo?",
        "nso": "O nyaka thušo?",
        "sot": "U hloka thuso?"
    },
    "infoBoxBDescription": {
        "en": "<p><ul><li>Dial <b>*134*7776#</b> to get a call back from the DBEs contact centre</li><li>Send an email to <b>banapele@dbe.gov.za</b></li><li>Send \"Hi\" to the DBEs Whatsapp line</li></ul></p>",
        "afr": "<p><ul><li>Skakel <b>*134*7776#</b> vir ''n terugbel van die DBE se kontaksentrum</li><li>Stuur ''n e-pos na <b>banapele@dbe.gov.za</b></li><li>Stuur \"Hi\" na die DBE se WhatsApp-lyn</li></ul></p>",
        "zul": "<p><ul><li>Shayela <b>*134*7776#</b> ukuze uthole ucingo olubuyayo oluvela esikhungwini sokuxhumana se-DBE</li><li>Thumela i-imeyili ku-<b>banapele@dbe.gov.za</b></li><li>Thumela \"Hi\" kulayini we-WhatsApp we-DBE</li></ul></p>",
        "xho": "<p><ul><li>Cofa <b>*134*7776#</b> ukuze ufumane umnxeba obuyayo ovela kwiziko lonxibelelwano le-DBE</li><li>Thumela i-imeyile ku-<b>banapele@dbe.gov.za</b></li><li>Thumela \"Hi\" kumgca we-WhatsApp we-DBE</li></ul></p>",
        "nso": "<p><ul><li>Letša <b>*134*7776#</b> gore o hwetše go letšwa morago go tšwa setsing sa kgokagano sa DBE</li><li>Romela imeile go <b>banapele@dbe.gov.za</b></li><li>Romela \"Hi\" go lene la WhatsApp la DBE</li></ul></p>",
        "sot": "<p><ul><li>Letsetsa <b>*134*7776#</b> ho fumana mohala o khutlang ho tsoa setsing sa ho ikopanya sa DBE</li><li>Romella imeile ho <b>banapele@dbe.gov.za</b></li><li>Romella \"Hi\" moleng oa WhatsApp oa DBE</li></ul></p>"
    },
    "infoBoxBLinkDescription": {
        "en": "Go to WhatsApp",
        "afr": "Gaan na WhatsApp",
        "zul": "Iya ku-WhatsApp",
        "xho": "Yiya ku-WhatsApp",
        "nso": "Eya go WhatsApp",
        "sot": "E-ea ho WhatsApp"
    },
    "buttonlinkA": {
        "en": "https://user-registration.dbecares.gov.za/",
        "afr": "https://user-registration.dbecares.gov.za/",
        "zul": "https://user-registration.dbecares.gov.za/",
        "xho": "https://user-registration.dbecares.gov.za/",
        "nso": "https://user-registration.dbecares.gov.za/",
        "sot": "https://user-registration.dbecares.gov.za/"
    },
    "buttonlinkB": {
        "en": "https://drive.google.com/file/d/1EiUnIFC6o5WI4lXHJXXjTnMyDPHOoP8o/view?usp=sharing",
        "afr": "https://drive.google.com/file/d/1EiUnIFC6o5WI4lXHJXXjTnMyDPHOoP8o/view?usp=sharing",
        "zul": "https://drive.google.com/file/d/1EiUnIFC6o5WI4lXHJXXjTnMyDPHOoP8o/view?usp=sharing",
        "xho": "https://drive.google.com/file/d/1EiUnIFC6o5WI4lXHJXXjTnMyDPHOoP8o/view?usp=sharing",
        "nso": "https://drive.google.com/file/d/1EiUnIFC6o5WI4lXHJXXjTnMyDPHOoP8o/view?usp=sharing",
        "sot": "https://drive.google.com/file/d/1EiUnIFC6o5WI4lXHJXXjTnMyDPHOoP8o/view?usp=sharing"
    },
    "buttonlinkC": {
        "en": "https://ecd.dbecares.gov.za/",
        "afr": "https://ecd.dbecares.gov.za/",
        "zul": "https://ecd.dbecares.gov.za/",
        "xho": "https://ecd.dbecares.gov.za/",
        "nso": "https://ecd.dbecares.gov.za/",
        "sot": "https://ecd.dbecares.gov.za/"
    },
    "infoBoxBLink": {
        "en": "https://wa.me/27877252059",
        "afr": "https://wa.me/27877252059",
        "zul": "https://wa.me/27877252059",
        "xho": "https://wa.me/27877252059",
        "nso": "https://wa.me/27877252059",
        "sot": "https://wa.me/27877252059"
    }
}'::jsonb;

  comply_translations := '{
    "visit": {
        "en": "Comply",
        "afr": "Voldoen",
        "zul": "Thobela",
        "xho": "Thobela",
        "nso": "Kgotsofatsa",
        "sot": "Phethahatsa"
    },
    "section": {
        "en": "You have one year from your Bronze certificate to complete this stage.",
        "afr": "Jy het een jaar vanaf jou Brons-sertifikaat om hierdie fase te voltooi.",
        "zul": "Unonyaka owodwa kusukela esitifiketini sakho seBronze ukuze uqedele lesi sigaba.",
        "xho": "Unonyaka omnye ukusuka kwisatifikethi sakho seBronze ukuze ugqibeze eli nqanaba.",
        "nso": "O na le ngwaga o tee go tloga setifikheiting sa gago sa Bronze gore o phethe kgato ye.",
        "sot": "U na le selemo se le sengoe ho tloha setifikeiting sa hau sa Bronze ho phetha mohato ona."
    },
    "type": {
        "en": "Comply",
        "afr": "Comply",
        "zul": "Comply",
        "xho": "Comply",
        "nso": "Comply",
        "sot": "Comply"
    },
    "infoBoxTitle": {
        "en": "Remember: registration is free. If anyone asks you to pay, contact the DBE.",
        "afr": "Onthou: registrasie is gratis. As iemand jou vra om te betaal, kontak die DBE.",
        "zul": "Khumbula: ukubhalisa kumahhala. Uma umuntu ekucela ukuthi ukhokhe, xhumana ne-DBE.",
        "xho": "Khumbula: ukubhalisa simahla. Ukuba umntu ukucela ukuba uhlawule, qhagamshelana ne-DBE.",
        "nso": "Gopola: ngwadišo ke mahala. Ge motho a go kgopela go lefa, ikopanye le DBE.",
        "sot": "Hopola: ngoliso ke mahala. Haeba motho a u kopa ho lefa, ikopanye le DBE."
    },
    "headerA": {
        "en": "Step 1: Check your venue",
        "afr": "Stap 1: Kontroleer jou lokaal",
        "zul": "Isinyathelo 1: Hlola indawo yakho",
        "xho": "Inyathelo 1: Khangela indawo yakho",
        "nso": "Kgato 1: Lekola lefelo la gago",
        "sot": "Mohato 1: Lekola sebaka sa hau"
    },
    "descriptionA": {
        "en": "<p>An Environmental Health Practitioner will visit to check that your centre is safe and meets the health standards. Use the checklist in the app to prepare your venue.</p>",
        "afr": "<p>''n Omgewingsgesondheidspraktisyn sal besoek om te bevestig dat jou sentrum veilig is en aan die gesondheidstandaarde voldoen. Gebruik die kontrolelys in die app om jou lokaal voor te berei.</p>",
        "zul": "<p>Umsebenzi Wezempilo Wezemvelo uzovakashela ukuze ahlole ukuthi isikhungo sakho siphephile futhi sihlangabezana namazinga ezempilo. Sebenzisa uhlu lokuhlola olukuhlelo ukulungiselela indawo yakho.</p>",
        "xho": "<p>Umsebenzi Wezempilo Wezendalo uya kundwendwela ukuze ajonge ukuba iziko lakho likhuselekile kwaye lihlangabezana nemigangatho yezempilo. Sebenzisa uluhlu lokukhangela kwi-app ukulungiselela indawo yakho.</p>",
        "nso": "<p>Mošomi wa Maphelo a Tikologo o tla etela go lekola gore setsi sa gago se bolokegile gomme se fihlela maemo a maphelo. Šomiša lenaneo la go hlahloba ka go app gore o lokisetše lefelo la gago.</p>",
        "sot": "<p>Mosebeletsi oa Bophelo bo Botle ba Tikoloho o tla etela ho hlahloba hore setsi sa hau se sireletsehile ''me se fihlela maemo a bophelo bo botle. Sebelisa lethathamo la ho hlahloba ho app ho lokisa sebaka sa hau.</p>"
    },
    "buttonlinkADescription": {
        "en": "Complete health & safety check",
        "afr": "Voltooi gesondheid- en veiligheidskontrole",
        "zul": "Qedela ukuhlolwa kwezempilo nokuphepha",
        "xho": "Gqiba ukuhlolwa kwezempilo nokhuseleko",
        "nso": "Phetha go hlahloba maphelo le polokego",
        "sot": "Qeta tlhahlobo ea bophelo bo botle le polokeho"
    },
    "headerB": {
        "en": "Step 2: Gather and submit documents",
        "afr": "Stap 2: Versamel en dien dokumente in",
        "zul": "Isinyathelo 2: Qoqa futhi uthumele amadokhumenti",
        "xho": "Inyathelo 2: Qokelela kwaye ungenise amaxwebhu",
        "nso": "Kgato 2: Kgobokanya le go romela ditokomane",
        "sot": "Mohato 2: Bokella le ho kenya litokomane"
    },
    "descriptionB": {
        "en": "<p>You will need to submit several documents. A social worker will visit to check your documents and how your programme runs. Download the guide or visit the ECD Info Hub to see exactly what you need to prepare.</p>",
        "afr": "<p>Jy sal verskeie dokumente moet indien. ''n Maatskaplike werker sal besoek om jou dokumente en hoe jou program loop na te gaan. Laai die gids af of besoek die ECD Info Hub om presies te sien wat jy moet voorberei.</p>",
        "zul": "<p>Uzodinga ukuthumela amadokhumenti amaningana. Umsebenzi wezenhlalakahle uzovakashela ukuze ahlole amadokhumenti akho nokuthi uhlelo lwakho lusebenza kanjani. Landa umhlahlandlela noma vakashela i-ECD Info Hub ukuze ubone ngqo ukuthi yini okudingeka uyilungiselele.</p>",
        "xho": "<p>Uya kufuneka ungenise amaxwebhu amaninzi. Umsebenzi wezentlalo uya kundwendwela ukuze ajonge amaxwebhu akho nendlela eqhuba ngayo inkqubo yakho. Khuphela isikhokelo okanye ndwendwela i-ECD Info Hub ukuze ubone ngqo oko kufuneka ukulungiselele.</p>",
        "nso": "<p>O tla nyaka go romela ditokomane tše mmalwa. Mošomi wa leago o tla etela go lekola ditokomane tša gago le kamoo lenaneo la gago le šomago ka gona. Laolla tšhupetšo goba etela ECD Info Hub gore o bone ka botlalo seo o swanetšego go se lokišetša.</p>",
        "sot": "<p>U tla hloka ho kenya litokomane tse ngata. Mosebeletsi oa sechaba o tla etela ho hlahloba litokomane tsa hau le kamoo lenaneo la hau le sebetsang kateng. Jarolla tataiso kapa etela ECD Info Hub ho bona hantle seo u hlokang ho se lokisa.</p>"
    },
    "buttonlinkBDescription": {
        "en": "Visit the ECD Info Hub",
        "afr": "Besoek die ECD Info Hub",
        "zul": "Vakashela i-ECD Info Hub",
        "xho": "Ndwendwela i-ECD Info Hub",
        "nso": "Etela ECD Info Hub",
        "sot": "Etela ECD Info Hub"
    },
    "buttonlinkCDescription": {
        "en": "Download the guide",
        "afr": "Laai die gids af",
        "zul": "Landa umhlahlandlela",
        "xho": "Khuphela isikhokelo",
        "nso": "Laolla tšhupetšo",
        "sot": "Jarolla tataiso"
    },
    "infoBoxBTitle": {
        "en": "Need help?",
        "afr": "Het jy hulp nodig?",
        "zul": "Udinga usizo?",
        "xho": "Ufuna uncedo?",
        "nso": "O nyaka thušo?",
        "sot": "U hloka thuso?"
    },
    "infoBoxBDescription": {
        "en": "<p><ul><li>Dial <b>*134*7776#</b> to get a call back from the DBEs contact centre</li><li>Send an email to <b>banapele@dbe.gov.za</b></li><li>Send \"Hi\" to the DBEs Whatsapp line</li></ul></p>",
        "afr": "<p><ul><li>Skakel <b>*134*7776#</b> vir ''n terugbel van die DBE se kontaksentrum</li><li>Stuur ''n e-pos na <b>banapele@dbe.gov.za</b></li><li>Stuur \"Hi\" na die DBE se WhatsApp-lyn</li></ul></p>",
        "zul": "<p><ul><li>Shayela <b>*134*7776#</b> ukuze uthole ucingo olubuyayo oluvela esikhungwini sokuxhumana se-DBE</li><li>Thumela i-imeyili ku-<b>banapele@dbe.gov.za</b></li><li>Thumela \"Hi\" kulayini we-WhatsApp we-DBE</li></ul></p>",
        "xho": "<p><ul><li>Cofa <b>*134*7776#</b> ukuze ufumane umnxeba obuyayo ovela kwiziko lonxibelelwano le-DBE</li><li>Thumela i-imeyile ku-<b>banapele@dbe.gov.za</b></li><li>Thumela \"Hi\" kumgca we-WhatsApp we-DBE</li></ul></p>",
        "nso": "<p><ul><li>Letša <b>*134*7776#</b> gore o hwetše go letšwa morago go tšwa setsing sa kgokagano sa DBE</li><li>Romela imeile go <b>banapele@dbe.gov.za</b></li><li>Romela \"Hi\" go lene la WhatsApp la DBE</li></ul></p>",
        "sot": "<p><ul><li>Letsetsa <b>*134*7776#</b> ho fumana mohala o khutlang ho tsoa setsing sa ho ikopanya sa DBE</li><li>Romella imeile ho <b>banapele@dbe.gov.za</b></li><li>Romella \"Hi\" moleng oa WhatsApp oa DBE</li></ul></p>"
    },
    "infoBoxBLinkDescription": {
        "en": "Go to WhatsApp",
        "afr": "Gaan na WhatsApp",
        "zul": "Iya ku-WhatsApp",
        "xho": "Yiya ku-WhatsApp",
        "nso": "Eya go WhatsApp",
        "sot": "E-ea ho WhatsApp"
    },
    "buttonlinkA": {
        "en": "",   
        "afr": "",
        "zul": "",
        "xho": "",
        "nso": "",
        "sot": ""
    },
    "buttonlinkB": {
        "en": "https://ecdinfohub.org/mass-registration/silver/",
        "afr": "https://ecdinfohub.org/mass-registration/silver/",
        "zul": "https://ecdinfohub.org/mass-registration/silver/",
        "xho": "https://ecdinfohub.org/mass-registration/silver/",
        "nso": "https://ecdinfohub.org/mass-registration/silver/",
        "sot": "https://ecdinfohub.org/mass-registration/silver/"
    },
    "buttonlinkC": {
        "en": "https://drive.google.com/file/d/1p2_gpqxkIqlLBnK5xQD1BORsjMrjJAlQ/view?usp=sharing",
        "afr": "https://drive.google.com/file/d/1p2_gpqxkIqlLBnK5xQD1BORsjMrjJAlQ/view?usp=sharing",
        "zul": "https://drive.google.com/file/d/1p2_gpqxkIqlLBnK5xQD1BORsjMrjJAlQ/view?usp=sharing",
        "xho": "https://drive.google.com/file/d/1p2_gpqxkIqlLBnK5xQD1BORsjMrjJAlQ/view?usp=sharing",
        "nso": "https://drive.google.com/file/d/1p2_gpqxkIqlLBnK5xQD1BORsjMrjJAlQ/view?usp=sharing",
        "sot": "https://drive.google.com/file/d/1p2_gpqxkIqlLBnK5xQD1BORsjMrjJAlQ/view?usp=sharing"
    },
    "infoBoxBLink": {
        "en": "https://wa.me/27877252059",
        "afr": "https://wa.me/27877252059",
        "zul": "https://wa.me/27877252059",
        "xho": "https://wa.me/27877252059",
        "nso": "https://wa.me/27877252059",
        "sot": "https://wa.me/27877252059"
    }
}'::jsonb;

    -- ====================== FIELD ID LOOKUP ======================
    SELECT "Id" INTO visit_field_id           FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'visit';
    SELECT "Id" INTO type_field_id            FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'type';
    SELECT "Id" INTO section_field_id         FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'section';
    SELECT "Id" INTO infoBox_title_field_id   FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'infoBoxTitle';
    SELECT "Id" INTO infoBox_description_field_id FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'infoBoxDescription';
    
    SELECT "Id" INTO headerA_field_id         FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'headerA';
    SELECT "Id" INTO descriptionA_field_id    FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'descriptionA';
    SELECT "Id" INTO buttonlinkA_field_id     FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'buttonlinkA';
    SELECT "Id" INTO buttonlinkADescription_field_id FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'buttonlinkADescription';

    SELECT "Id" INTO headerB_field_id         FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'headerB';
    SELECT "Id" INTO descriptionB_field_id    FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'descriptionB';
    SELECT "Id" INTO buttonlinkB_field_id     FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'buttonlinkB';
    SELECT "Id" INTO buttonlinkBDescription_field_id FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'buttonlinkBDescription';

    SELECT "Id" INTO headerC_field_id         FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'headerC';
    SELECT "Id" INTO descriptionC_field_id    FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'descriptionC';
    SELECT "Id" INTO buttonlinkC_field_id     FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'buttonlinkC';
    SELECT "Id" INTO buttonlinkCDescription_field_id FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'buttonlinkCDescription';

    SELECT "Id" INTO infoBoxB_title_field_id         FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'infoBoxBTitle';
    SELECT "Id" INTO infoBoxB_description_field_id   FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'infoBoxBDescription';
    SELECT "Id" INTO infoBoxB_link_field_id          FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'infoBoxBLink';
    SELECT "Id" INTO infoBoxB_link_description_field_id FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'infoBoxBLinkDescription';
    SELECT "Id" INTO availableLanguages_field_id FROM "ContentTypeField" WHERE "ContentTypeId" = 15 AND "FieldName" = 'availableLanguages';

    IF visit_field_id IS NULL THEN RAISE EXCEPTION 'Field "visit" not found for ContentTypeId=15'; END IF;
    IF buttonlinkA_field_id IS NULL THEN RAISE EXCEPTION 'Field "buttonlinkA" not found'; END IF;
    IF buttonlinkB_field_id IS NULL THEN RAISE EXCEPTION 'Field "buttonlinkB" not found'; END IF;
    IF buttonlinkC_field_id IS NULL THEN RAISE EXCEPTION 'Field "buttonlinkC" not found'; END IF;
    IF infoBoxB_title_field_id IS NULL THEN RAISE EXCEPTION 'Field "infoBoxBTitle" not found'; END IF;
    IF infoBoxB_link_field_id IS NULL THEN RAISE EXCEPTION 'Field "infoBoxBLink" not found'; END IF;

    FOREACH tenant_id IN ARRAY tenant_ids LOOP
        RAISE NOTICE 'Processing tenant: %', tenant_id;

        SELECT "SiteAddress" INTO siteAddress 
        FROM "Tenant" WHERE "Id" = tenant_id::uuid LIMIT 1;

        IF siteAddress IS NULL THEN
            RAISE NOTICE 'Warning: No SiteAddress for tenant %', tenant_id;
            siteAddress := '';
        END IF;

        -- Create ONE Content record per tenant (shared by all languages) for apply
        INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
        VALUES (15, true, CURRENT_DATE, CURRENT_DATE, '', tenant_id::uuid, false)
        RETURNING "Id" INTO content_id_apply;

        -- Create ONE Content record per tenant (shared by all languages) for comply
        INSERT INTO public."Content" ("ContentTypeId", "IsActive", "InsertedDate", "UpdatedDate", "UpdatedBy", "TenantId", "IsReadOnly")
        VALUES (15, true, CURRENT_DATE, CURRENT_DATE, '', tenant_id::uuid, false)
        RETURNING "Id" INTO content_id_comply;

        -- Loop over languages
        FOREACH current_locale IN ARRAY locales LOOP

            RAISE NOTICE '  → Locale: %', current_locale;

            -- Helper: map locale code to UUID
            DECLARE
               locale_uuid UUID := CASE 
                    WHEN current_locale = 'en'  THEN locale_en_id::uuid
                    WHEN current_locale = 'afr' THEN locale_afr_id::uuid
                    WHEN current_locale = 'zul' THEN locale_zul_id::uuid
                    WHEN current_locale = 'xho' THEN locale_xho_id::uuid
                    WHEN current_locale = 'nso' THEN locale_nso_id::uuid
                    WHEN current_locale = 'sot' THEN locale_sot_id::uuid
                    ELSE NULL 
                END;
            BEGIN
                IF locale_uuid IS NULL THEN CONTINUE; END IF;

                -- Insert all fields for Apply using JSON
                FOR field_name, field_value IN 
                    SELECT key, value->>current_locale 
                    FROM jsonb_each(apply_translations)
                LOOP
                    -- Get field_id dynamically (you can cache these in variables for performance)
                    SELECT "Id" INTO field_id 
                    FROM "ContentTypeField" 
                    WHERE "ContentTypeId" = 15 AND "FieldName" = field_name;

                    IF field_id IS NOT NULL AND field_value IS NOT NULL THEN
                        INSERT INTO public."ContentValue" 
                        ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
                        VALUES (
                            nextval('public."ContentValue_Id_seq"'),
                            content_id_apply,
                            locale_uuid,
                            field_id,
                            field_value,
                            null,
                            tenant_id::uuid,
                            CURRENT_DATE,
                            CURRENT_DATE
                        );
                    END IF;
                END LOOP;

                -- Insert all fields for Comply using JSON
                FOR field_name, field_value IN 
                    SELECT key, value->>current_locale 
                    FROM jsonb_each(comply_translations)
                LOOP
                    -- Get field_id dynamically (you can cache these in variables for performance)
                    SELECT "Id" INTO field_id 
                    FROM "ContentTypeField" 
                    WHERE "ContentTypeId" = 15 AND "FieldName" = field_name;

                    IF field_id IS NOT NULL AND field_value IS NOT NULL THEN
                        INSERT INTO public."ContentValue" 
                        ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
                        VALUES (
                            nextval('public."ContentValue_Id_seq"'),
                            content_id_comply,
                            locale_uuid,
                            field_id,
                            CASE 
                                WHEN field_name = 'buttonlinkA' THEN 'https://' || siteAddress || '/practitioner-profile?tabIndex=1'
                                ELSE field_value 
                            END,
                            null,
                            tenant_id::uuid,
                            CURRENT_DATE,
                            CURRENT_DATE
                        );
                    END IF;
                END LOOP;
            END;
        END LOOP;

         INSERT INTO public."ContentValue" 
                        ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
                        VALUES (
                            nextval('public."ContentValue_Id_seq"'),
                            content_id_apply,
                            locale_en_id::uuid,
                            availableLanguages_field_id,
                            locale_en_id::text || ',' || locale_afr_id::text || ',' || locale_zul_id::text || ',' || locale_xho_id::text || ',' || locale_nso_id::text || ',' || locale_sot_id::text,
                            null,
                            tenant_id::uuid,
                            CURRENT_DATE,
                            CURRENT_DATE
                        );
                         INSERT INTO public."ContentValue" 
                        ("Id", "ContentId", "LocaleId", "ContentTypeFieldId", "Value", "StatusId", "TenantId", "InsertedDate", "UpdatedDate")
                        VALUES (
                            nextval('public."ContentValue_Id_seq"'),
                            content_id_comply,
                            locale_en_id::uuid,
                            availableLanguages_field_id,
                            locale_en_id::text || ',' || locale_afr_id::text || ',' || locale_zul_id::text || ',' || locale_xho_id::text || ',' || locale_nso_id::text || ',' || locale_sot_id::text,
                            null,
                            tenant_id::uuid,
                            CURRENT_DATE,
                            CURRENT_DATE
                        );
    END LOOP;

    RAISE NOTICE 'Script completed successfully.';
END $$;

select ctf."Id" , ctf."FieldOrder" , ctf."FieldName" , ctf."DataLinkName" , ctf."FieldTypeId" , cft."Name" , cft."Description" , cft."DataType" ,cft."AssemblyDataType" 
from "ContentTypeField" ctf 
join "ContentFieldType" cft on cft."Id" = ctf."FieldTypeId" 
where ctf."ContentTypeId" = '15'
order by ctf."FieldOrder" ;

select * from "ContentValue" cv 
where cv."InsertedDate" is not null
and cv."InsertedDate" > '2026-02-13'
order by cv."InsertedDate" desc;

select * from "Content" c 
where c."InsertedDate" is not null
and c."InsertedDate" > '2026-02-13'
order by c."InsertedDate" desc;

ROLLBACK;   -- Uncomment for testing
-- COMMIT;