export const UploadImageAPI = (ImageUploadURL, file) => {
  // console.log("File details:", {
  //   name: file.name,
  //   type: file.type,
  //   size: `${(file.size / 1024).toFixed(2)} KB`,
  // });
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("ImageFile", file);

    xhr.open("POST", ImageUploadURL, true);

    xhr.onload = function () {
      if (xhr.status === 201) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error("Upload failed"));
      }
    };

    xhr.onerror = function () {
      reject(new Error("Network error"));
    };

    xhr.send(formData);
  });
};
