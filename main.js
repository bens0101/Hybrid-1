const url = "https://picsum.photos/v2/list?page=2&limit=30";
var expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 7);
console.log(expiryDate);

async function fetchAndCacheImage() {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Something went wrong");
        }
        
        const data = await response.json();
        console.log(data);

        const cache = await caches.open('exercise');

        for (let image of data) {
            const imageUrl = image.download_url;
            const imageResponse = await fetch(imageUrl);
            if (imageResponse.ok) {
                await cache.put(imageUrl, imageResponse.clone());
                console.log(`Image cached successfully: ${imageUrl}`);
            } else {
                console.alert(`Failed to fetch image: ${imageUrl}`);
            }
        }
    } catch (error) {
        console.error("Failed to fetch and cache images:", error);
    }
}

async function getImage() {
    const cache = await caches.open('exercise');

    const retrieveData = await cache.keys();
    if (retrieveData.length > 0) {
        console.log("Cache contents:");
        for (let request of retrieveData) {
            const cacheResponse = await cache.match(request);
            const cacheTime = new Date(cacheResponse.headers.get('date'));
            console.log(`URL: ${request.url}, Cached At: ${cacheTime.toLocaleString()}`);

            const imageBlob = await cacheResponse.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            
            const imgElement = document.createElement('img');
            imgElement.src = imageUrl;
            document.body.appendChild(imgElement);
        }
    } else {
        await fetchAndCacheImage();
    }
}

getImage();