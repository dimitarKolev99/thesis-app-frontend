import { useApplianceVoucherStore } from "@/stores/ApplianceSerialPairs";

const applianceSerialStore = useApplianceVoucherStore();

let iv;
let ciphertext;

export const generateAndSaveKey = async () => {
  try {
    const algorithm = { name: "AES-GCM", length: 256 };
    const key = await crypto.subtle.generateKey(algorithm, true, [
      "encrypt",
      "decrypt",
    ]);

    const exportedKey = await crypto.subtle.exportKey("jwk", key);
    const keyString = JSON.stringify(exportedKey);

    localStorage.setItem("myKey", keyString);

    console.log("Key generated and saved to local storage.");
  } catch (error) {
    console.error("Error generating and saving the key:", error);
  }
};

export const retrieveKeyFromStorage = () => {
  const keyString = localStorage.getItem("myKey");
  if (keyString) {
    const key = JSON.parse(keyString);
    return crypto.subtle.importKey("jwk", key, { name: "AES-GCM" }, true, [
      "encrypt",
      "decrypt",
    ]);
  } else {
    console.error("Key not found in local storage.");
    return Promise.reject("Key not found");
  }
};

export const encryptAndWriteToFile = async (jsonString, key, serialNumber) => {
  try {
    // Convert the JSON string to Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(jsonString);

    const iv = crypto.getRandomValues(new Uint8Array(12));

    localStorage.setItem("iv", JSON.stringify(Array.from(iv)));
    // Encrypt the data
    ciphertext = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const encryptedFile = new File([ciphertext], `${serialNumber}.bin`, { type: "application/octet-stream" });

    // Save the file using the FileSystem API
    const fileHandle = await window.showSaveFilePicker({
      suggestedName: `${serialNumber}.bin`
    });
    const writable = await fileHandle.createWritable();
    await writable.write(encryptedFile);
    await writable.close();

    console.log("Encryption completed and file downloaded.");

    return Promise.resolve();
  } catch (error) {
    console.error("Error encrypting and writing to file:", error);
    
    return Promise.reject(error);

  }
};

export const readEncryptedFileAndDecrypt = async (file, key) => {
  try {
    const encryptedData = await readFileAsArrayBuffer(file);

    const ivString = localStorage.getItem("iv");
    const iv = new Uint8Array(JSON.parse(ivString));


    const decryptedText = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      encryptedData
      );


    // Convert the decrypted data to a UTF-8 string
    const decoder = new TextDecoder();
    const decryptedString = decoder.decode(decryptedText);

    // Parse the decrypted string as JSON
    const decryptedJSON = JSON.parse(decryptedString);

    console.log("Decrypted JSON:", decryptedJSON);
      
    return decryptedJSON;
  } catch (error) {
    console.error("Error reading and decrypting file:", error);
  }
};

export const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}
