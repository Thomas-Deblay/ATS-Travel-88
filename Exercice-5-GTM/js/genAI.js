/* =========================
 Just Doing the necessary to import JSON container file
 variable name : container
================================*/

const response = await fetch('./js/containerLVMH.json');
const container = await response.json();

console.log(container);

/**=========================================================================================
 * 
 * Begenning of the real code, following the instructions built in GenAi group w/ Maiana, Jonathand and Thomas.
 * ------------------------------------------------------------------------------------------------------------
 * Start now : 
 * 
 1. Les informations à vérifier sont dans l’objet “containerVersion”
2. Dans cet objet, il y a 3 arrays qui nous intéressent:
    L’array “tag” qui contient tous les tags du container 
    L’array “trigger” qui contient tous les triggers du container
    L’array “variable” qui contient toutes les variables du container

3. Commençons par l’array “tag”
 Trouve l’object qui a pour “type” la valeur “googtag”. Cet object est notre Google Tag. On l’appellera maintenant cet object “Google Tag”
Dans le tableau “parameter” de notre Google Tag, retrouve la “value” des objects ayant pour “key”: “configSettingsVariable” et “eventSettingsVariable”.
Retire les doubles semicolones ouvrantes et fermantes au début et à la fin de ces valeurs. Exemple : “{{test - settings}}” à “test - settings”
À présent, dans l’object “containerversion”, dans l’array “variable”, trouve l’object de type “gtcs” et “gtes”. 
Concatane les “LIST” de ces deux objets
Map toutes les “parameterValue” et enlève les semi-colonnes afin de constituer une liste de variables
Va dans le tableau “variable” et retrouve les variables dont le “name” correspond au “parameterValue” transformée de notre liste précédente
Ne sélectionne que celles qui remplissent une des conditions suivantes : 
 La variable a un “type” égal à “v”  
La variable a un type égal à “Remm” et remplit toutes les conditions suivantes:
Dans “parameter”,regarde la “key” qui est égale à “input” et prend sa “value” en enleveant ses semicolonnes
Retourne dans l’array “variable” et trouve la variable dont le “name” correspond à la “value” transformée de l’étape précédente
Si le “type” de cette variable est égale à “v”alors garde dans le tableau la “value” de la variable de l’array “variable”, de type “v”
La variable a un type égal à “Smm” et remplit toutes les conditions suivantes :
Dans “parameter”, regarde la “key” qui est égale à “input” et prend sa “value” en enlevant ses semicolonnes
Retourne dans l’array “variable” et trouve la variable dont le “name” correspond à la “value” transformée de l’étape précédente
Si le “type” de cette variable est égale à “v”alors garde dans le tableau la “value” de la variable de l’array “variable”, de type “v”
Exclue toutes les variables de type “jsm” et de type “awec”
Créé un tableau avec une colonne “Parameter Value”, inséres-y les variables sélectionnées précédemment
Maintenant supprime les variables qui sont en doublons cad les variables qui ont la même valeur parameter, dont le type “Template”
Peux-tu à présent écrire un push d'initialisation avec toutes les variables de la colonne “Parameter Value” ? Voici un exemple pour t’aider 
Peux-tu me créer un fichier csv 

window.dataLayer.push({
parameterValue1: $parameterValue1, 
parameterValue2: $parameterValue2, 
}) 


 - GA4 window dataLayer pushes
À présent va dans le tableau “trigger”, trouve tous les triggers de type “CUSTOM_EVENT”  avec un “customEventFilter” contenant un objet avec un paramètre “type” égal à “EQUALS” 
Dans “customEventFilter”, dans l’array “parameter”, retrouve l’objet contenant un param “key” avec une value “arg1” et récupère la valeur du paramètre “value”.
Mets cette “value” dans la colonne “Event name” d’un tableau
Pour chaque trigger retenu, récupère leur “triggerId” .
Ajoute ces “triggerID” dans notre tableau, dans une colonne “Trigger ID” 
Retourne dans le tableau “tag” du JSON
Recherche dans les objets de type “gaawe” contenant les “firingTriggerId” retenus dans l’étape précédente.
Pour chaque tag, identifie l’array “parameter” 
Identifie s’il y a un objet de type “sendEcommerceData” avec une value “true” 
Si oui ? Mets en miroir la “value” du trigger et trouve la correspondance dans le tableau de GA4 - ecommerce 
Si la “value” du trigger est “view_item_list” ou “select_item”, rajoute les paramètres suivants dans une colonne “Parameter Value” 



ecommerce: {
    item_list_id: $item_list_id,
    item_list_name: $item_list_name,
    items: [
     {
      item_id: $item_id,
      item_name: $item_name,
      affiliation: $affiliation,
      coupon: $coupon,
      discount: $discount,
      index: $index,
      item_brand: $item_brand,
      item_category: $item_category,
      item_category2: $item_category2,
      item_category3: $item_category3,
      item_category4: $item_category4,
      item_category5: $item_category5,
      item_list_id: $item_list_id:,
      item_list_name: $item_list_name,
      item_variant: $item_variant,
      location_id:$location_id,
      price: $price,
      quantity: $quantity
    }

Si la value est égale à “view_item” ou “add_to_cart” ou “add_to_wishlist, ou “view_cart”, “remove_from_cart”


  ecommerce: {
    currency: $currency,
    value: $value,
    items: [
     {
      item_id: $item_id,
      item_name: $item_name,
      affiliation: $affiliation,
      coupon: $coupon,
      discount: $discount,
      index: $index,
      item_brand: $item_brand,
      item_category: $item_category,
      item_category2: $item_category2,
      item_category3: $item_category3,
      item_category4: $item_category4,
      item_category5: $item_category5,
      item_list_id: $item_list_id:,
      item_list_name: $item_list_name,
      item_variant: $item_variant,
      location_id:$location_id,
      price: $price,
      quantity: $quantity
    }
  ]
  }
Si la value est égale à “begin_checkout”, 
Si la value est égale à “add_shipping_info”
Si la value est égale à “add_payment_info”
Si la value est égale à “purchase”

Si non ? Passe à l’étape suivante.
Identifie s’il y a une key “eventSettingsVariable” 
Retire les doubles semicolones ouvrantes et fermantes au début et à la fin de ces valeurs. Exemple : “{{test - settings}}” à “test - settings”
À présent, dans l’object “containerversion”, dans l’array “variable”, trouve l’object de type “gtes”. 
Map toutes les “parameterValue” et enlève les semi-colonnes afin de constituer une liste de variables
Va dans le tableau “variable” et retrouve les variables dont le “name” correspond au “parameterValue” transformée de notre liste précédente
Ne sélectionne que celles qui remplissent une des conditions suivantes
La variable a un “type” égal à “v”  
La variable a un type égal à “Remm” et remplit toutes les conditions suivantes:
Dans “parameter”,regarde la “key” qui est égale à “input” et prend sa “value” en enleveant ses semicolonnes
Retourne dans l’array “variable” et trouve la variable dont le “name” correspond à la “value” transformée de l’étape précédente
Si le “type” de cette variable est égale à “v” alors garde dans le tableau la “value” de la variable de l’array “variable”, de type “v”
La variable a un type égal à “Smm” et remplit toutes les conditions suivantes :
Dans “parameter”, regarde la “key” qui est égale à “input” et prend sa “value” en enlevant ses semicolonnes
Retourne dans l’array “variable” et trouve la variable dont le “name” correspond à la “value” transformée de l’étape précédente
Si le “type” de cette variable est égale à “v” alors garde dans le tableau la “value” de la variable de l’array “variable”, de type “v”
Exclue toutes les variables de type “jsm” et de type “awec”
Identifie s’il y a un objet de type “LIST” avec une key “eventSettingsTable”
Si oui, identifie l’array “list”, il contient des objets avec un key “type” dont la valeur est égale à “MAP” et dont un paramètre “map” est un array. 
Map toutes les “parameterValue” et enlève les semi-colonnes afin de constituer une liste de variables
Va dans le tableau “variable” et retrouve les variables dont le “name” correspond au “parameterValue” transformée de notre liste précédente
Ne sélectionne que celles qui remplissent une des conditions suivantes : 
 La variable a un “type” égal à “v”  
La variable a un type égal à “Remm” et remplit toutes les conditions suivantes:
Dans “parameter”,regarde la “key” qui est égale à “input” et prend sa “value” en enlevant ses point-virgules
Retourne dans l’array “variable” et trouve la variable dont le “name” correspond à la “value” transformée de l’étape précédente
Si le “type” de cette variable est égale à “v”alors garde dans le tableau la “value” de la variable de l’array “variable”, de type “v”
La variable a un type égal à “Smm” et remplit toutes les conditions suivantes :
Dans “parameter”, regarde la “key” qui est égale à “input” et prend sa “value” en enlevant ses semicolonnes
Retourne dans l’array “variable” et trouve la variable dont le “name” correspond à la “value” transformée de l’étape précédente
Si le “type” de cette variable est égale à “v”alors garde dans le tableau la “value” de la variable de l’array “variable”, de type “v”
Exclue toutes les variables de type “jsm” et de type “awec”
Exclue toutes les variables de type “jsm” et de type “awec”
Maintenant supprime les variables qui sont en doublons
Peux-tu à présent écrire un push d'initialisation avec toutes les variables de la colonne “Parameter Value” ? Il faut que le paramètre event renvoie la valeur contenue dans la colonne “Event Name” et les parameterValue1, 2 et suivants sont ceux contenus dans la colonne “Parameter Value” de notre tableau
Voici un exemple pour t’aider 


window.dataLayer.push({
event: event name
parameterValue1: $parameterValue1, 
parameterValue2: $parameterValue2, 
}) 

Peux-tu à présent partager toutes ces informations dans un fichier CSV ? 

 * 
 */

var tag = container.containerVersion.tag;
var trigger = container.containerVersion.trigger;
var variable = container.containerVersion.variable;

var tableauEventPush = [];

//Taking out the semicolones at the begennings and at the ends ==> {{test}} -> test
function getRealName(name){
    let newName = name.slice(2);
    return newName.slice(0,-2);
}

function getVariablesListFromNameEventSettings(name){
    for(let x of variable){
        if(x.name===name){
            return x.parameter[0].list;
        }
    }
    return null;
}

function getVariableNameInVariable(variable){
    const parameter = variable.parameter;
    for(let x of parameter){
        if(x.key==="name"){
            return x.value;
        }
    }
}

function toReturnIfDLVVariable(variableName){
    for (let x of variable){
        if(x.name===variableName){
            if(x.type==='v'){
                return getVariableNameInVariable(x);
            }
        }
    }
    return null;
}

function returnListOfVaribaleNamesFromList(list){
    const listOfNames = list.map((x) => getRealName(x.map[1].value));
    
    return listOfNames.map((x) => toReturnIfDLVVariable(x)).filter((x) => x !== null);
}

function getEventSettingsVariables(){
    const googleTag = tag.filter((x)=> x.type==='googtag')
    const parameterArray = googleTag[0].parameter;
    let eventSettings;
    for(let x of parameterArray){
        if(x.key==='eventSettingsVariable'){
            eventSettings = getRealName(x.value);
        }
    }

    let listOfVaribales = getVariablesListFromNameEventSettings(eventSettings);

    return returnListOfVaribaleNamesFromList(listOfVaribales);
}

function createDataLayerPush(event, variables){
    let push = 'dataLayer.push(\n{\n';
    if(event){
        push += `event : $${event},\n`;
    }

    for(let variable of variables){
        push += `${variable} : $${variable},\n`;
    }

    push += '}\n)';
    return push;
}

function getAllTrigger(){
    const wantedTriggers = trigger.filter((x) => x.type === "CUSTOM_EVENT" && x.customEventFilter)

    return wantedTriggers;
}

function getAllTriggerNameAndId(){
    const wantedTriggers = getAllTrigger();

    return wantedTriggers.map((trigger) => ({name: `${trigger.customEventFilter[0].parameter[1].value}`, id: `${trigger.triggerId}`}) )
}

function pushAnEventInTableau(trigger){

    let colonne = {
        triggerEvent : {
            name : `${trigger.name} `,
            triggerId: `${trigger.id}` , 
        },
        pushEvent : {
            push : '',
        }
    };

    return tableauEventPush.push(colonne);

}

function createTableau(){
    const allTrigger = getAllTriggerNameAndId();

    allTrigger.forEach((trigger) => pushAnEventInTableau(trigger))

    return 1;
}

function getAllRelatedTagsToTrigger(colonne){
     
    return tag.filter((x) => (x.firingTriggerId !== undefined ? x.firingTriggerId.includes(colonne.triggerEvent.triggerId) : false ))
}

function createDataLayerPushByEvent(){

    tableauEventPush.forEach((colonne, index) => {
        let dataLayerPush = getAllRelatedTagsToTrigger(colonne);
        dataLayerPush = dataLayerPush[0];
        console.log(dataLayerPush);
        // dataLayerPush = dataLayerPush.filter((x) => x.type==="LIST");
        // dataLayerPush = dataLayerPush[0].list;
        tableauEventPush.splice(index, 1, {...colonne,
        pushEvent : {
            push : dataLayerPush,
        }
    } )}  
    )

    console.log(tableauEventPush);
}

/**---------------------------------------------
 * Testing Part when i try console logs
 -----------------------------------------------
 */


const eventSettingsVariablesArray = getEventSettingsVariables();

console.log(createDataLayerPush(false,eventSettingsVariablesArray))
createTableau();
createDataLayerPushByEvent();

console.log(tableauEventPush);