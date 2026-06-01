export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "crafty_upload"); // ✅ this is correct

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/decw2jxsq/image/upload", // ❗ FIX HERE
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Cloudinary upload failed");
  }

  const data = await res.json();

  if (!data.secure_url) {
    throw new Error("No URL returned from Cloudinary");
  }

  return data.secure_url;
}