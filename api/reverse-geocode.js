export default async function handler(req, res) {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: "Missing lat or lon" });
  }

  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=json` +
      `&lat=${encodeURIComponent(lat)}` +
      `&lon=${encodeURIComponent(lon)}` +
      `&addressdetails=1`;

    const osmRes = await fetch(url, {
      headers: {
        // 🔴 MUST be real & descriptive
        "User-Agent":
          "help-yaar/1.0 (contact: varunraje@gmail.com)",

        // 🔴 Strongly recommended
        "Accept": "application/json",
        "Accept-Language": "en-IN,en;q=0.9",
        "Referer": "http://localhost:3000"
      }
    });

    if (!osmRes.ok) {
      const text = await osmRes.text();
      console.error("OSM HTTP error:", osmRes.status, text);
      return res.status(500).json({
        error: "OSM request failed",
        status: osmRes.status
      });
    }

    const data = await osmRes.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Reverse geocoding exception:", error);
    return res.status(500).json({ error: "Reverse geocoding failed" });
  }
}
