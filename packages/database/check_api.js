// Use native global fetch

async function run() {
  const urls = [
    'http://localhost:5001/api/v1/cms/pages/home',
    'https://atlasapi.grekam.in/api/v1/cms/pages/home'
  ];
  for (const url of urls) {
    try {
      console.log(`Fetching ${url}...`);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log(`Success! Section count:`, data.sections ? data.sections.length : 0);
        if (data.sections) {
          for (const sec of data.sections) {
            console.log(`- Section ID: ${sec.id}, Type: ${sec.type}`);
            if (sec.type === 'IMAGE_SCROLL' || sec.type === 'IMAGE_ROW' || sec.content?.headline?.includes('Look')) {
              console.log('Content details:', JSON.stringify(sec.content, null, 2));
            }
          }
        }
      } else {
        console.log(`Failed with status ${res.status}`);
      }
    } catch (err) {
      console.error(`Error:`, err.message);
    }
  }
}

run();
