document.getElementById('searchButton').addEventListener('click', () => {
    const vin = document.getElementById('vinInput').value;
    if (!vin) {
        alert('Please enter a VIN');
        return;
    }

    const apiUrl = `https://cws.gm.com/vs-cws/vehshop/v2/vehicle?vin=${vin}&postalCode=48640&locale=en_US`;

    fetch(apiUrl, {
        headers: {
    "authority": "cws.gm.com",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "max-age=0",
    "sec-ch-ua": '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"',
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": '"Windows"',
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "none",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
}
    })
    .then(response => response.json())
    .then(data => {
        let result = 'Vehicle not found in GM System - Confirm VIN is appearing correctly in CDK.';
        
        if (data.mathBox && data.mathBox.recallInfo && data.mathBox.recallInfo.includes("This vehicle is temporarily unavailable")) {
            result = "Vehicle with Recall";
        } else if (data.inventoryStatus && data.inventoryStatus.name) {
            if (data.inventoryStatus.name === "Rtl_Intrans") {
                result = "In Transit on Website - May Not Appear in HomeNet";
            } else if (data.inventoryStatus.name === "EligRtlStkCT") {
                result = "Courtesy Vehicle";
            } else {
                result = `Inventory Status: ${data.inventoryStatus.name}`;
            }
        }

        document.getElementById('result').textContent = result;
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('result').textContent = 'Error fetching data';
    });
});
