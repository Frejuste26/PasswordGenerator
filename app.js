// Sélection des éléments HTML
const alerte = document.getElementById('alert');
const lengthInput = document.getElementById('length');
const passwordDisplay = document.getElementById('password');
const copyBtn = document.getElementById('copy');
const resetBtn = document.getElementById('reset');
const uppercaseCb = document.getElementById('uppercase');
const lowercaseCb = document.getElementById('lowercase');
const numberCb = document.getElementById('number');
const symbolCb = document.getElementById('symbol');
const generateBtn = document.getElementById('generate');

// Masquer le mot de passe par défaut
passwordDisplay.style.webkitTextSecurity = 'disc';

// Validation de la longueur (entre 1 et 50)
lengthInput.addEventListener('input', (e) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    e.target.value = val ? Math.min(50, parseInt(val)) : '';
});

// Sauvegarde des préférences dans localStorage
function savePreferences() {
    const preferences = {
        length: lengthInput.value,
        uppercase: uppercaseCb.checked,
        lowercase: lowercaseCb.checked,
        number: numberCb.checked,
        symbol: symbolCb.checked
    };
    localStorage.setItem('passwordPreferences', JSON.stringify(preferences));
}

// Chargement des préférences au démarrage
function loadPreferences() {
    const preferences = JSON.parse(localStorage.getItem('passwordPreferences'));
    if (preferences) {
        lengthInput.value = preferences.length;
        uppercaseCb.checked = preferences.uppercase;
        lowercaseCb.checked = preferences.lowercase;
        numberCb.checked = preferences.number;
        symbolCb.checked = preferences.symbol;
    }
}

// Calcul de la force du mot de passe
function calculatePasswordStrength(length) {
    let strength = 0;
    if (uppercaseCb.checked) strength += 1;
    if (lowercaseCb.checked) strength += 1;
    if (numberCb.checked) strength += 1;
    if (symbolCb.checked) strength += 1;

    if (length < 8) return 1; // Faible
    if (length < 12) return Math.min(strength, 3); // Moyen
    return strength; // Fort ou Très fort
}

// Génération du mot de passe
generateBtn.addEventListener('click', () => {
    const passwordLength = parseInt(lengthInput.value);
    if (isNaN(passwordLength) || passwordLength < 1 || passwordLength > 50) {
        alerte.textContent = 'Veuillez entrer une longueur valide (1-50)';
        return;
    }
    if (!uppercaseCb.checked && !lowercaseCb.checked && !numberCb.checked && !symbolCb.checked) {
        alerte.textContent = 'Veuillez sélectionner au moins une option';
        return;
    }

    let chars = '';
    if (uppercaseCb.checked) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercaseCb.checked) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numberCb.checked) chars += '0123456789';
    if (symbolCb.checked) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let password = '';
    for (let i = 0; i < passwordLength; i++) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        const shuffle = array[0] % chars.length;
        password += chars[shuffle];
    }

    passwordDisplay.textContent = password;
    passwordDisplay.style.webkitTextSecurity = 'none';

    const strength = calculatePasswordStrength(passwordLength);
    const strengthText = ['Faible', 'Moyen', 'Fort', 'Très fort'][strength - 1];
    alerte.textContent = `Force du mot de passe : ${strengthText}`;
    alerte.style.color = ['#ff0000', '#ffa500', '#ffff00', '#00ff00'][strength - 1];

    savePreferences();
});

// Copie du mot de passe dans le presse-papiers
copyBtn.addEventListener('click', async () => {
    if (passwordDisplay.textContent === 'Votre mot de passe') {
        alerte.textContent = 'Générez d\'abord un mot de passe';
        return;
    }
    try {
        await navigator.clipboard.writeText(passwordDisplay.textContent);
        alerte.textContent = 'Mot de passe copié dans le presse-papiers';
        setTimeout(() => alerte.textContent = '', 2000);
    } catch (err) {
        alerte.textContent = 'Échec de la copie';
    }
});

// Réinitialisation des champs
resetBtn.addEventListener('click', () => {
    passwordDisplay.textContent = 'Votre mot de passe';
    passwordDisplay.style.webkitTextSecurity = 'disc';
    lengthInput.value = '';
    alerte.textContent = '';
    uppercaseCb.checked = false;
    lowercaseCb.checked = false;
    numberCb.checked = false;
    symbolCb.checked = false;
});

// Génération automatique si la longueur change
lengthInput.addEventListener('change', () => {
    if (lengthInput.value && (uppercaseCb.checked || lowercaseCb.checked || numberCb.checked || symbolCb.checked)) {
        generateBtn.click();
    }
});

// Chargement initial des préférences
loadPreferences();