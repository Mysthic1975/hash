// Funktion zur Generierung eines SHA-256 Hash's eines Eingabetextes
function mySHA256(input) {
    // Erstellen eines TextEncoders
    const encoder = new TextEncoder();
    // Umwandlung des Eingabetextes in einen Byte-Array
    const data = encoder.encode(input);

    // Verwenden der SubtleCrypto API, um einen SHA-256-Hash des Byte-Arrays zu generieren
    return window.crypto.subtle.digest('SHA-256', data).then(hash => {
        // Initialisierung des Ergebnis-Strings
        let result = '';
        // Erstellen eines DataView-Objekts für den Zugriff auf den Hash
        const view = new DataView(hash);
        // Durchlaufen des Hash's in 4-Byte-Schritten
        for (let i = 0; i < hash.byteLength; i += 4) {
            // Hinzufügen des hexadezimalen Werts des aktuellen 4-Byte-Blocks zum Ergebnis-String
            result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
        }
        // Rückgabe des Ergebnis-Strings
        return result;
    });
}