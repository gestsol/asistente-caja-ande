<?php

function get_data()
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_URL => "https://socketgpsv1.gestsol.cl/api/lpf",
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json"
        ),
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYPEER => false
    ));

    $response = json_decode(curl_exec($curl));
    print_r(json_encode($response));
    $err = curl_error($curl);

    curl_close($curl);
    return $response;
}


function get_data_flota($filter)
{
    $curl = curl_init();
    curl_setopt_array($curl, array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_ENCODING => "",
        CURLOPT_MAXREDIRS => 10,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
        CURLOPT_URL => "https://socketgpsv1.gestsol.cl/api/lpf?company_id=$filter",
        CURLOPT_CUSTOMREQUEST => "GET",
        CURLOPT_HTTPHEADER => array(
            "content-type: application/json"
        ),
        CURLOPT_SSL_VERIFYHOST => false,
        CURLOPT_SSL_VERIFYPEER => false
    ));

    $response = json_decode(curl_exec($curl));
    $err = curl_error($curl);

    curl_close($curl);
    return $response;
}

function get_position($name)
{
    $devices = get_data();
    $found = [];
    foreach ($devices as $device) {
        if (strpos(strtolower($device->name), strtolower($name)) !== false) {
            array_push($found, $device->name . " https://www.google.com/maps/?q=" . $device->lat . "," . $device->lng);
        }
        if (strpos(str_replace('-', '', strtolower($device->plate)), str_replace('-', '', strtolower($name))) !== false) {
            array_push($found, $device->plate . " https://www.google.com/maps/?q=" . $device->lat . "," . $device->lng);
        }
    }
    return $found;
}

function get_geofence($filter)
{
    $geofences = '[{"alert":false,"company_id":11,"geofence_type_id":1,"geom":{"ne":{"lat":-33.27809040545184,"lng":-70.99366097711027},"sw":{"lat":-33.34580171945057,"lng":-71.12412362359464}},"id":62,"name":"test contoles"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.50647667797365,"lng":-70.65289665006344},"radius":47.43936179399538},"id":70,"name":"Agencia Carmen Mena"},{"alert":false,"company_id":11,"geofence_type_id":1,"geom":{"ne":{"lat":-33.379855141224546,"lng":-70.4995716000418},"sw":{"lat":-33.57458472547573,"lng":-70.78796271332305}},"id":39,"name":"prueba victor"},{"alert":false,"company_id":11,"geofence_type_id":1,"geom":{"ne":{"lat":-33.379855141224546,"lng":-70.4995716000418},"sw":{"lat":-33.57458472547573,"lng":-70.78796271332305}},"id":40,"name":"prueba victor"},{"alert":false,"company_id":11,"geofence_type_id":3,"geom":{"ne":{"lat":-33.325149605276536,"lng":-70.93048959039152},"sw":{"lat":-33.3595670750184,"lng":-71.00052743218839}},"id":59,"name":"test controles"},{"alert":false,"company_id":11,"geofence_type_id":1,"geom":{"ne":{"lat":-33.27809040545184,"lng":-70.99366097711027},"sw":{"lat":-33.34580171945057,"lng":-71.12412362359464}},"id":60,"name":"test contoles"},{"alert":false,"company_id":11,"geofence_type_id":1,"geom":{"ne":{"lat":-33.27809040545184,"lng":-70.99366097711027},"sw":{"lat":-33.34580171945057,"lng":-71.12412362359464}},"id":61,"name":"test contoles"},{"alert":false,"company_id":11,"geofence_type_id":1,"geom":{"ne":{"lat":-33.27809040545184,"lng":-70.99366097711027},"sw":{"lat":-33.34580171945057,"lng":-71.12412362359464}},"id":63,"name":"test contoles"},{"alert":false,"company_id":11,"geofence_type_id":1,"geom":{"center":{"lat":-33.42987262204299,"lng":-70.91263680718839},"radius":5508.685543377452},"id":64,"name":"carlos"},{"alert":false,"company_id":11,"geofence_type_id":1,"geom":{"center":{"lat":-33.42987262204299,"lng":-70.91263680718839},"radius":5508.685543377452},"id":66,"name":"carlos"},{"alert":false,"company_id":11,"geofence_type_id":1,"geom":{"center":{"lat":-33.434456880049524,"lng":-70.89890389703214},"radius":4388.987419084745},"id":67,"name":"carlos"},{"alert":false,"company_id":11,"geofence_type_id":1,"geom":{"center":{"lat":-33.43904089589992,"lng":-70.88654427789152},"radius":2341.611884532367},"id":68,"name":"carlos 2"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"ne":{"lat":-23.54719035204376,"lng":-70.38986472581428},"sw":{"lat":-23.548301754358704,"lng":-70.3914525935511}},"id":73,"name":"Bencinera Antofagasta taller PAC"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-24.249779422087514,"lng":-69.09527190158963},"radius":42.60129317576165},"id":87,"name":"Bencinera Faena Escondida"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"ne":{"lat":-22.429639889374332,"lng":-68.92500866574471},"sw":{"lat":-22.4310679568826,"lng":-68.92699886483376}},"id":77,"name":"Bencinera Calama"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"ne":{"lat":-33.44999639852579,"lng":-70.62889132087719},"sw":{"lat":-33.450349993464506,"lng":-70.62937143629085}},"id":71,"name":"Agencia Bustamante"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.090918269927,"lng":-70.39756265946903},"radius":357.16138082418416},"id":50,"name":"La Junta (I) "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.0862132706336,"lng":-70.44978405584527},"radius":1273.8982308016316},"id":43,"name":"Colon (A) "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.159714174395,"lng":-70.741270618584},"radius":4700},"id":53,"name":"Rancagua (E) "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.099047823325094,"lng":-70.43157365990686},"radius":302.8559927347945},"id":44,"name":"Entrada tunel "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.088349520003014,"lng":-70.38783633586928},"radius":202.86717693244924},"id":45,"name":"Adit 71 "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.09710117897006,"lng":-70.4247944404691},"radius":298.9028676007093},"id":46,"name":"Salida tunel "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.08159687113145,"lng":-70.35866036830794},"radius":489.491427024207},"id":48,"name":"Adit 42 (G) "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.1062339695879,"lng":-70.36899013409402},"radius":364.2689075508159},"id":49,"name":"Joachim (K) "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.21406788434404,"lng":-70.77324636942342},"radius":278.889920507561},"id":55,"name":"Tandem "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.0853613404459,"lng":-70.38284738208921},"radius":1921.1160467773234},"id":47,"name":"Sewell (F) "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.1928896078915,"lng":-70.56319583192749},"radius":326.69203996986914},"id":54,"name":"Maitenes (H) "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.20500640534641,"lng":-70.53016069347854},"radius":1355.5890255544143},"id":56,"name":"Coya (D) "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.0971604257497,"lng":-70.52015397863329},"radius":316.8130039886873},"id":57,"name":"Barahona (C) "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.15224924126473,"lng":-70.54988594196101},"radius":406.0406078354191},"id":58,"name":"La Paula (J) "},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.1936087525836,"lng":-70.6486163054114},"radius":95.54536244328635},"id":52,"name":"Guindal "},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"ne":{"lat":-23.617151107106096,"lng":-70.38772894289508},"sw":{"lat":-23.618483095050394,"lng":-70.38905931856647}},"id":75,"name":"Bencinera Antofagasta Terminal"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-18.464123649214603,"lng":-70.29982080383684},"radius":49.12576109448999},"id":76,"name":"Bencinera Arica"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-26.25214231044399,"lng":-69.62618561059935},"radius":79.60581568277313},"id":83,"name":"Bencinera El Salvador"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"ne":{"lat":-33.45810505395573,"lng":-70.64944966889936},"sw":{"lat":-33.45863315850461,"lng":-70.65033211566526}},"id":97,"name":"Agencia San Diego"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"ne":{"lat":-33.025669382386376,"lng":-71.54627136039994},"sw":{"lat":-33.027346997372085,"lng":-71.547902143481}},"id":108,"name":"Bencinera Lago Peñuelas"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-41.45691499883233,"lng":-72.96059224085565},"radius":76.79564644992337},"id":111,"name":"Bencinera Puerto Montt"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.53704476926918,"lng":-70.74043527964773},"radius":223.7155971770892},"id":114,"name":"Cerro Sombrero"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-26.339971405010235,"lng":-70.62100254232968},"radius":72.32834135115587},"id":78,"name":"Bencinera Chañaral"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-36.81811972734832,"lng":-72.98864411572345},"radius":85.78630404758165},"id":79,"name":"Bencinera Concepcion Storage COPEC"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-27.370034011878396,"lng":-70.3338811258173},"radius":29.87823102209129},"id":80,"name":"Bencinera Copiapo"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"ne":{"lat":-33.4647820586906,"lng":-70.6813702223273},"sw":{"lat":-33.46567708031341,"lng":-70.68262549614627}},"id":81,"name":"Bencinera Dolores"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"ne":{"lat":-33.454659805259595,"lng":-70.67754676930485},"sw":{"lat":-33.45513646107291,"lng":-70.67800274483739}},"id":82,"name":"Agencia Exposición"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"ne":{"lat":-33.457551651223476,"lng":-70.68540867519278},"sw":{"lat":-33.45799808164546,"lng":-70.68572919917005}},"id":84,"name":"Agencia Jotabeche"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-22.926367461649225,"lng":-69.10170603551023},"radius":39.73944223984786},"id":85,"name":"Bencinera Faena Centinela Oxidos Tesoro"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-23.00812324025208,"lng":-69.09902599925977},"radius":42.846141531613924},"id":86,"name":"Bencinera Faena Centinela Sulfuros Esper"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.487711885856214,"lng":-70.5499822147263},"radius":77.6938750193699},"id":89,"name":"Agencia La Reina"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"ne":{"lat":-33.44709893491411,"lng":-70.65710179766222},"sw":{"lat":-33.44724216820226,"lng":-70.6572600479941}},"id":98,"name":"Agencia San Ignacio"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-37.441033400702544,"lng":-72.32860613604629},"radius":83.53394550879752},"id":109,"name":"Bencinera Los Angeles"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-38.71039716414641,"lng":-72.55658003238631},"radius":90.68735979019621},"id":112,"name":"Bencinera Temuco"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"ne":{"lat":-33.04557574307142,"lng":-71.61547595864016},"sw":{"lat":-33.04604339385194,"lng":-71.6159158409186}},"id":115,"name":"Bencinera Valparaiso Storage Petrobras"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-31.817421975061407,"lng":-70.57671929446798},"radius":59.11503047990299},"id":88,"name":"Bencinera Faena Los Pelambres"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"ne":{"lat":-33.54016067564418,"lng":-70.57396338859883},"sw":{"lat":-33.540390943975694,"lng":-70.57440327087727}},"id":91,"name":"Agencia La Florida"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.383730145250105,"lng":-70.76244897885636},"radius":130.9596350857109},"id":92,"name":"Agencia Lo Boza"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.45668411506118,"lng":-70.63739610668341},"radius":31.295226307023004},"id":93,"name":"Agencia Matta"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"ne":{"lat":-33.47112734091802,"lng":-70.61010307839257},"sw":{"lat":-33.47140030350747,"lng":-70.61047322323662}},"id":94,"name":"Agencia Ñuñoa"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.42592350038958,"lng":-70.64314296618903},"radius":11.024810150317098},"id":95,"name":"Agencia Patronato"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.590323456465725,"lng":-70.70323680967704},"radius":14.398682566251805},"id":96,"name":"Agencia San Bernardo"},{"alert":false,"company_id":39,"geofence_type_id":6,"geom":{"ne":{"lat":-33.45340471955454,"lng":-70.64761770788175},"sw":{"lat":-33.45380081973893,"lng":-70.64812196317655}},"id":100,"name":"Agencia Serrano"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"ne":{"lat":-33.45439065276627,"lng":-70.68062413596067},"sw":{"lat":-33.455500611235294,"lng":-70.68107206486616}},"id":101,"name":"Agencia Borja"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.44687874732824,"lng":-70.67865564722024},"radius":47.23917950760239},"id":69,"name":"Agencia Chacabuco"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.40301469291085,"lng":-70.65749406666004},"radius":16.748555609086846},"id":11,"name":"Agencia Einstein"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.454439321735016,"lng":-70.68536197736285},"radius":17.35206270511029},"id":99,"name":"Agencia Thomson"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.17851787582021,"lng":-70.65322287274381},"radius":1149.2858210361717},"id":103,"name":"Mechali"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.10637748976758,"lng":-70.45081370134903},"radius":737.4164980372882},"id":102,"name":"Caletones"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-20.213920470914488,"lng":-70.13193835874193},"radius":65.65244722061554},"id":104,"name":"Bencinera Iquique"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"ne":{"lat":-33.457059934775316,"lng":-70.68544669011493},"sw":{"lat":-33.45775616103237,"lng":-70.68642837861438}},"id":105,"name":"Bencinera Jotabeche"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-29.908168543907284,"lng":-71.25644759679278},"radius":79.06500947370859},"id":106,"name":"Bencinera La Serena Storage Petrobras"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-39.27720923650443,"lng":-71.97205639169982},"radius":55.40946021268376},"id":110,"name":"Bencinera Pucon Storage Enex"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-39.850609397352095,"lng":-73.19550119771174},"radius":56.49949143633954},"id":113,"name":"Bencinera Valdivia"},{"alert":false,"company_id":39,"geofence_type_id":1,"geom":{"center":{"lat":-32.73204049192144,"lng":-71.45186297754151},"radius":51.65308210578468},"id":116,"name":"Bencinera Ventanas"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.45239633886512,"lng":-70.55596742609288},"radius":59.57467112435279},"id":90,"name":"Agencia Larrain "},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.44379025059745,"lng":-70.6503943924443},"radius":52.70194822865614},"id":117,"name":"Agencia Metro U de Chile"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-33.479986035240685,"lng":-70.69203233074984},"radius":20.00446512987424},"id":72,"name":"Agencia Cerrillos"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.19580519268953,"lng":-70.6732556251763},"radius":435.1061660544979},"id":130,"name":"Nogales"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.166470631239925,"lng":-70.76386986858665},"radius":55.585399461607295},"id":121,"name":"BAQUEDANO"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.183184626000106,"lng":-70.72555958854457},"radius":85.7532410241871},"id":122,"name":"MANZANAL ESPECIAL"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.13266501361348,"lng":-70.73794123217908},"radius":73.44573103042079},"id":123,"name":"SOL - DON MATEO"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.14752766113015,"lng":-70.72998232673064},"radius":88.86066986695761},"id":125,"name":"NORTE MEMBRILLAR"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.13071400506799,"lng":-70.75110901480099},"radius":286.26242903928056},"id":126,"name":"NELSON PEREIRA"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.171154724755425,"lng":-70.77712617401346},"radius":396.0816888442575},"id":120,"name":"ORO NEGRO-SAN PEDRO"},{"alert":true,"company_id":34,"geofence_type_id":2,"geom":{"center":{"lat":-34.206888593766,"lng":-70.76497568270054},"radius":163.28578638377385},"id":131,"name":"COPEC GULTRO"},{"alert":true,"company_id":34,"geofence_type_id":2,"geom":{"center":{"lat":-34.1997563475465,"lng":-70.75981504592744},"radius":96.76098075529627},"id":132,"name":"GULTRO"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-20.43062221023012,"lng":-70.1588592390608},"radius":664.7459460009816},"id":134,"name":"Iquique (Caleta pesquera los verdes)"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-26.282408987555996,"lng":-69.58859899298034},"radius":2167.3005813177506},"id":139,"name":"Salvador (Llanta)"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.17883741043092,"lng":-70.71286756298753},"radius":100.73861887440232},"id":124,"name":"ALAMEDA - MACHALI - LA VINILLA"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-32.61240099999804,"lng":-71.23439464063932},"radius":176.41990579724938},"id":144,"name":"Nogales"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-30.712926204825397,"lng":-71.49130945612069},"radius":397.70427270844834},"id":143,"name":"Ovalle (Socos)"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-29.831607011692412,"lng":-71.26441619977265},"radius":528.9178880723811},"id":142,"name":"Serena Norte (Punta Teatinos)"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-29.974656504047744,"lng":-71.34242530063386},"radius":467.10889305354226},"id":141,"name":"caleta los Hornos"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-22.073513371396054,"lng":-70.19231232700201},"radius":285.3033841244047},"id":136,"name":"Tocopilla "},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-20.24806730219579,"lng":-69.78384331951372},"radius":1283.492065568768},"id":135,"name":"Iquique (Pozo Almonte)"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-18.84178836162913,"lng":-70.13146665324143},"radius":3204.2287124354984},"id":133,"name":"Arica (Chaca)"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-26.305469486719144,"lng":-70.453181630546},"radius":2131.9914524682545},"id":138,"name":"Chañaral (Portezuelo Blanco)"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-27.414067701043965,"lng":-70.27271149725544},"radius":990.8711621927519},"id":140,"name":"Copiapo (Paipote)"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"center":{"lat":-34.1666576181813,"lng":-70.7233315924775},"radius":128.0235594777177},"id":127,"name":"Zenith 1"},{"alert":false,"company_id":34,"geofence_type_id":8,"geom":{"ne":{"lat":-34.20080156228091,"lng":-70.68823536179804},"sw":{"lat":-34.20090804454394,"lng":-70.68823536179804}},"id":129,"name":"Nogales"},{"alert":false,"company_id":34,"geofence_type_id":4,"geom":{"center":{"lat":-34.19387299055685,"lng":-70.75528495914216},"radius":236.49440947238142},"id":119,"name":"puente cachapoal"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.04662165314015,"lng":-71.6057671169703},"sw":{"lat":-33.04728714752324,"lng":-71.60692583126473}},"id":147,"name":"KA"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-32.753952302813076,"lng":-70.71961632047424},"sw":{"lat":-32.754762110626324,"lng":-70.72062214885483}},"id":163,"name":"LX"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.407723733243834,"lng":-71.69251215736244},"sw":{"lat":-33.40825662251172,"lng":-71.69304055253838}},"id":164,"name":"KM"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-33.955631151358354,"lng":-70.71373745713146},"radius":364.6515058268131},"id":145,"name":"San Francisco de Mostazal"},{"alert":false,"company_id":29,"geofence_type_id":8,"geom":{"center":{"lat":-33.433102341952534,"lng":-71.19431029219817},"radius":1027.9646891835255},"id":149,"name":"RO"},{"alert":true,"company_id":29,"geofence_type_id":7,"geom":{"ne":{"lat":-33.454675507781914,"lng":-70.6856451885522},"sw":{"lat":-33.454979324645294,"lng":-70.6860421554864}},"id":158,"name":"APARCADERO"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.02400522665895,"lng":-71.54523622659042},"sw":{"lat":-33.02566038496897,"lng":-71.54796135094955}},"id":148,"name":"KB"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.45761597662721,"lng":-70.71518094804094},"sw":{"lat":-33.45778212097183,"lng":-70.71590514447496}},"id":168,"name":"TP"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.591630614572324,"lng":-71.61391847624526},"sw":{"lat":-33.59258241501043,"lng":-71.61460780396209}},"id":156,"name":"KQ"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-32.98672362304233,"lng":-71.27232966075951},"sw":{"lat":-32.9872275831199,"lng":-71.27309140811974}},"id":171,"name":"KF"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.539496878001266,"lng":-71.5952996860965},"sw":{"lat":-33.540017779390425,"lng":-71.59595414509613}},"id":160,"name":"KK"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.4542477210762,"lng":-71.66864044925569},"sw":{"lat":-33.45445807754653,"lng":-71.66935659906267}},"id":161,"name":"KL"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.047670733692584,"lng":-71.43158677006699},"sw":{"lat":-33.04845088115809,"lng":-71.43193813944794}},"id":165,"name":"KD"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-18.463962938523906,"lng":-70.29956181738487},"radius":63.09969861897721},"id":173,"name":"Agencia Arica"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-20.213895723568935,"lng":-70.13186839786044},"radius":60.47948238484146},"id":174,"name":"Agencia Iquique (Sotomayor)"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-23.60884766025424,"lng":-70.38932655789682},"radius":63.88328484791799},"id":176,"name":"Agencia Antofagasta"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-26.24677115215172,"lng":-69.62848264741444},"radius":49.969228385117965},"id":178,"name":"Agencia El Salvador"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-26.346661331244253,"lng":-70.62106613236983},"radius":59.45156132193764},"id":180,"name":"Agencia Chañaral"},{"alert":true,"company_id":47,"geofence_type_id":8,"geom":{"center":{"lat":-22.878450351981527,"lng":-69.31249200655077},"radius":15437.879360355957},"id":137,"name":"Calama (Sierra Gorda)"},{"alert":false,"company_id":34,"geofence_type_id":1,"geom":{"ne":{"lat":-32.91291791775572,"lng":-70.62466518672989},"sw":{"lat":-32.913782569189024,"lng":-70.6253518322377}},"id":128,"name":"Prueba"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.45296111082922,"lng":-70.68566578966949},"sw":{"lat":-33.4541486168414,"lng":-70.68612042409751}},"id":157,"name":"MB"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.45316660581796,"lng":-70.67925782937402},"sw":{"lat":-33.456236902798224,"lng":-70.68030389088983}},"id":169,"name":"MA"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.37030162636699,"lng":-71.66746530076898},"sw":{"lat":-33.370601786048425,"lng":-71.6677388860885}},"id":159,"name":"KN"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-32.82654973517233,"lng":-70.59876112077205},"sw":{"lat":-32.82709968550877,"lng":-70.60006467435329}},"id":162,"name":"LJ"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.0428489343902,"lng":-71.37287235255224},"sw":{"lat":-33.04296809933128,"lng":-71.37334442133886}},"id":166,"name":"KE"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-32.99522333501608,"lng":-71.18124447484979},"sw":{"lat":-32.995922961430864,"lng":-71.182003540001}},"id":167,"name":"KG"},{"alert":true,"company_id":29,"geofence_type_id":8,"geom":{"ne":{"lat":-33.45422207566437,"lng":-70.68743749960538},"sw":{"lat":-33.45474742773323,"lng":-70.68868204458829}},"id":146,"name":"MD"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-20.21610653278129,"lng":-70.14747307427717},"radius":21.668009064253113},"id":175,"name":"Agencia iquique (Barros)"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-22.437718780841227,"lng":-68.91676086947263},"radius":98.97971680111914},"id":177,"name":"Agencia Calama"},{"alert":true,"company_id":39,"geofence_type_id":6,"geom":{"center":{"lat":-26.39189364564252,"lng":-70.04750814827901},"radius":119.60219882978237},"id":179,"name":"Agencia Diego almagro"}]';
    $geofences = json_decode($geofences);
    $devices = get_data();
    $found = [];
    foreach ($geofences as $geofence) {
        if (strpos(strtolower($geofence->name), strtolower($filter)) !== false) {
            foreach ($devices as $device) {
                if ($device->geofence_id == $geofence->id) {
                    array_push($found, $geofence->name . " - " . $device->name . " https://www.google.com/maps/?q=" . $device->lat . "," . $device->lng);
                }
            }
        }
    }
    return $found;
}

function get_status()
{
    $devices = get_data();
    $countStop = 0;
    $countStop1h = 0;
    $countStop1d = 0;
    $countMoving = 0;
    $text = '';
    foreach ($devices as $device) {
        if ($device->stop_time >= 1440) {
            $countStop1d += 1;
        }
        if ($device->stop_time < 1440 && $device->stop_time >= 60) {
            $countStop1h += 1;
        }
        if ($device->stop_time < 60 && $device->stop_time > 0) {
            $countStop += 1;
        }
        if ($device->stop_time == 0) {
            $countMoving += 1;
        }
        $text = '*' . $countStop . '* vehículos detenidos hace menos de una hora \\n';
        $text .= '*' . $countStop1h . '* vehículos detenidos hace más de una hora y menos de 1 día \\n';
        $text .= '*' . $countStop1d . '* vehículos detenidos hace más de 1 día \\n';
        $text .= '*' . $countMoving . '* vehículos en movimiento';
    }
    return $text;
}


function get_status_flota($filter)
{
    $cids = [];
    $companies = '[{"geotab_group_id":null,"id":2,"name":"Demo"},{"geotab_group_id":null,"id":8,"name":"Pulverizadores Parada SA"},{"geotab_group_id":null,"id":11,"name":"GESTSOL"},{"geotab_group_id":null,"id":12,"name":"Minera Escondida"},{"geotab_group_id":null,"id":1,"name":"ADMIN"},{"geotab_group_id":null,"id":13,"name":"Pruebas Pullman"},{"geotab_group_id":null,"id":9,"name":"Pullman Cargo"},{"geotab_group_id":null,"id":14,"name":"Mutual de seguridad"},{"geotab_group_id":null,"id":15,"name":"Romani bus"},{"geotab_group_id":null,"id":16,"name":"Pullman bus"},{"geotab_group_id":null,"id":17,"name":"Expreso Norte"},{"geotab_group_id":null,"id":18,"name":"Julio César S.A."},{"geotab_group_id":null,"id":23,"name":"Minera Escondida Limitada"},{"geotab_group_id":null,"id":24,"name":"Tandem"},{"geotab_group_id":null,"id":25,"name":"Pullman Cargo Gerencia Bruno Montalva"},{"geotab_group_id":null,"id":26,"name":"Sinach"},{"geotab_group_id":null,"id":27,"name":"Francisco Silva"},{"geotab_group_id":"10","id":28,"name":"Tandem / Pullman Cargo"},{"geotab_group_id":null,"id":29,"name":"Pullman Costa Central"},{"geotab_group_id":null,"id":30,"name":"Sinach"},{"geotab_group_id":null,"id":31,"name":"MEL DEMO"},{"geotab_group_id":null,"id":32,"name":"Troncales Pullman Cargo"},{"geotab_group_id":null,"id":33,"name":"Viña Bus"},{"geotab_group_id":null,"id":34,"name":"Teniente"},{"geotab_group_id":null,"id":35,"name":"Transportes De la Fuente"},{"geotab_group_id":null,"id":36,"name":"Pullman JB Los Angeles"},{"geotab_group_id":null,"id":37,"name":"Lomas Bayas"},{"geotab_group_id":null,"id":38,"name":"Molynor"},{"geotab_group_id":null,"id":39,"name":"CMPC"},{"geotab_group_id":null,"id":41,"name":"Interprovincial Minero"},{"geotab_group_id":null,"id":42,"name":"Las Condes"},{"geotab_group_id":null,"id":43,"name":"Buses Ahumada"},{"geotab_group_id":null,"id":44,"name":"Urbanos Pullman Cargo"},{"geotab_group_id":null,"id":45,"name":"Admin Las Condes"},{"geotab_group_id":null,"id":46,"name":"Demo Gestsol"},{"geotab_group_id":null,"id":47,"name":"Pullman Norte-Sur"},{"geotab_group_id":null,"id":49,"name":"Nilahue"},{"geotab_group_id":null,"id":50,"name":"TandemRadio"},{"geotab_group_id":null,"id":51,"name":"Tandem Guanaco"},{"geotab_group_id":null,"id":52,"name":"Dataprom"},{"geotab_group_id":null,"id":53,"name":"Teknokont"}]';
    $companies = json_decode($companies);
    $text = '';
    foreach ($companies as $c) {
        if (strpos(strtolower($c->name), strtolower($filter)) !== false) {
            $data = [];
            $data['name'] = $c->name;
            $data['id'] = $c->id;
            array_push($cids, $data);
        }
    }
    if (count($cids) == 0 ){
        $devices = get_data();
    }
    else {
        $devices = get_data_flota($cids[0]['id']);
        $text .= '*_'.$cids[0]['name'].'_* \\n ';
    }
    $countStop = 0;
    $countStop1h = 0;
    $countStop1d = 0;
    $countMoving = 0;
    foreach ($devices as $device) {
        if ($device->stop_time >= 1440) {
            $countStop1d += 1;
        }
        if ($device->stop_time < 1440 && $device->stop_time >= 60) {
            $countStop1h += 1;
        }
        if ($device->stop_time < 60 && $device->stop_time > 0) {
            $countStop += 1;
        }
        if ($device->stop_time == 0) {
            $countMoving += 1;
        }
    }
    $text .= '*' . $countStop . '* vehículos detenidos hace menos de una hora \\n ';
    $text .= '*' . $countStop1h . '* vehículos detenidos hace más de una hora y menos de 1 día \\n ';
    $text .= '*' . $countStop1d . '* vehículos detenidos hace más de 1 día \\n ';
    $text .= '*' . $countMoving . '* vehículos en movimiento';
    return $text;
}

echo get_status_flota( 'mutual');