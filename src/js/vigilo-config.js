export const INSTANCES = [
    {
        name: "Montpellier",
        scope: "34_montpellier",
        url: "https://vigilo.jesuisundesdeux.org",
    },
    {
        name: "Châtillon",
        scope: "92_chatillon",
        url: "https://api.vigilo.vpchatillon.fr"
    },
    {
        name: "Dev-vigilo",
        scope: "develop",
        url: "https://dev-vigilo.alwaysdata.net",
    },
]

export function getInstance(){
    var instance = localStorage.getItem('vigilo-instance');
    if (instance == null){
        return instance
    } else {
        return JSON.parse(instance)
    }
}
export function setInstance(name){
    for (var i in INSTANCES){
        if (INSTANCES[i].name == name){
            localStorage.setItem('vigilo-instance', JSON.stringify(INSTANCES[i]))
            break;
        }
    }
    window.location.reload()
}