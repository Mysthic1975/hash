// Funktion zur Verschlüsselung eines Textes mit AES
async function myAES(input, secretKey) {
    // Erstellen eines TextEncoders
    const encoder = new TextEncoder();
    // Umwandlung des Eingabetextes in einen Byte-Array
    const data = encoder.encode(input);

    // Ableitung eines Schlüsselmaterials aus dem geheimen Schlüssel
    const keyMaterial = await window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: encoder.encode('salt'), iterations: 100000, hash: 'SHA-256' },
        await window.crypto.subtle.importKey('raw', encoder.encode(secretKey), { name: 'PBKDF2' }, false, ['deriveKey']),
        { name: 'AES-CBC', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );

    // Generierung eines zufälligen Initialisierungsvektors (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    // Verschlüsselung des Eingabetextes mit dem abgeleiteten Schlüssel und dem IV
    const ciphertext = await window.crypto.subtle.encrypt(
        { name: 'AES-CBC', iv: iv },
        keyMaterial,
        data
    );

    // Rückgabe des verschlüsselten Textes und des IV als Base64-kodierte Strings
    return {
        ciphertext: btoa(String.fromCharCode.apply(null, new Uint8Array(ciphertext))),
        iv: btoa(String.fromCharCode.apply(null, iv))
    };
}

// Funktion zur Entschlüsselung eines mit AES verschlüsselten Textes
async function myAESDecrypt(encryptedBase64, secretKey, ivBase64) {
    // Erstellen eines TextEncoders
    const encoder = new TextEncoder();
    // Umwandlung des verschlüsselten Textes und des IV von Base64-kodierten Strings in Byte-Arrays
    const data = new Uint8Array(atob(encryptedBase64).split('').map(c => c.charCodeAt(0)));
    const ivUint8Array = new Uint8Array(atob(ivBase64).split('').map(c => c.charCodeAt(0)));

    // Ableitung eines Schlüsselmaterials aus dem geheimen Schlüssel
    const keyMaterial = await window.crypto.subtle.deriveKey(
        { name: 'PBKDF2', salt: encoder.encode('salt'), iterations: 100000, hash: 'SHA-256' },
        await window.crypto.subtle.importKey('raw', encoder.encode(secretKey), { name: 'PBKDF2' }, false, ['deriveKey']),
        { name: 'AES-CBC', length: 256 },
        false,
        ['encrypt', 'decrypt']
    );

    // Entschlüsselung des verschlüsselten Textes mit dem abgeleiteten Schlüssel und dem IV
    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-CBC', iv: ivUint8Array },
        keyMaterial,
        data
    );

    // Rückgabe des entschlüsselten Textes als String
    return new TextDecoder().decode(decrypted);
}