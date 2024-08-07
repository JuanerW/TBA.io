// Default colors
const defaultSettings = {
    sidebarColor: '#F07167',
    headerColor: '#F07167',
    backgroundColor: '#FDFCDC',
    doColor: '#FF8C89',
    decideColor: '#FFEDCD',
    delegateColor: '#33D1CC',
    deleteColor: '#3399CC',
    CompleteColor: '#00AFB9',
    InProgressColor: '#F07167',
    NotStartColor: '#FFD166'
};

// Open and close sidebar function
function toggleNav() {
    var sidebar = document.getElementById("mySidebar");
    var main = document.getElementById("main");
    if (sidebar.style.width === "250px") {
        sidebar.style.width = "0";
        main.style.marginLeft = "0";
    } else {
        sidebar.style.width = "250px";
        main.style.marginLeft = "250px";
    }
}

// Save settings to localStorage
function saveSettings(event) {
    event.preventDefault();

    const sidebarColor = document.getElementById('sidebarColor').value;
    const headerColor = document.getElementById('headerColor').value;
    const backgroundColor = document.getElementById('backgroundColor').value;
    const doColor = document.getElementById('doColor').value;
    const decideColor = document.getElementById('decideColor').value;
    const delegateColor = document.getElementById('delegateColor').value;
    const deleteColor = document.getElementById('deleteColor').value;

    const CompleteColor = document.getElementById('CompleteColor').value;
    const InProgressColor = document.getElementById('InProgressColor').value;
    const NotStartColor = document.getElementById('NotStartColor').value;

    const settings = {
        sidebarColor,
        headerColor,
        backgroundColor,
        doColor,
        decideColor,
        delegateColor,
        deleteColor,
        CompleteColor,
        InProgressColor,
        NotStartColor
    };

    localStorage.setItem('settings', JSON.stringify(settings));
    alert('Settings saved!');
    applySettings();
}

// Load settings from localStorage
function loadSettings() {
    const settings = JSON.parse(localStorage.getItem('settings'));

    if (settings) {
        document.getElementById('sidebarColor').value = settings.sidebarColor;
        document.getElementById('headerColor').value = settings.headerColor;
        document.getElementById('backgroundColor').value = settings.backgroundColor;
        document.getElementById('doColor').value = settings.doColor;
        document.getElementById('decideColor').value = settings.decideColor;
        document.getElementById('delegateColor').value = settings.delegateColor;
        document.getElementById('deleteColor').value = settings.deleteColor;

        document.getElementById('CompleteColor').value = settings.CompleteColor;
        document.getElementById('InProgressColor').value = settings.InProgressColor;
        document.getElementById('NotStartColor').value = settings.NotStartColor;

        applySettings();
    } else {
        // Set default values if no settings are found
        document.getElementById('sidebarColor').value = defaultSettings.sidebarColor;
        document.getElementById('headerColor').value = defaultSettings.headerColor;
        document.getElementById('backgroundColor').value = defaultSettings.backgroundColor;
        document.getElementById('doColor').value = settings.doColor;
        document.getElementById('decideColor').value = settings.decideColor;
        document.getElementById('delegateColor').value = settings.delegateColor;
        document.getElementById('deleteColor').value = settings.deleteColor;

        document.getElementById('CompleteColor').value = settings.CompleteColor;
        document.getElementById('InProgressColor').value = settings.InProgressColor;
        document.getElementById('NotStartColor').value = settings.NotStartColor;
        
        applySettings(defaultSettings);
    }
}

// Apply settings to the page
function applySettings(settings = JSON.parse(localStorage.getItem('settings')) || defaultSettings) {
    document.querySelector('.sidebar').style.backgroundColor = settings.sidebarColor;
    document.querySelector('.header-container').style.backgroundColor = settings.headerColor;
    document.body.style.backgroundColor = settings.backgroundColor;
}

// Reset color to default
function resetColor(inputId, defaultColor) {
    document.getElementById(inputId).value = defaultColor;
    applySettings();
}

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});
