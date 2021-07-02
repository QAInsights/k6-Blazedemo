// Importing relevant js libraries from k6
import { sleep, group, check } from "k6";
import { SharedArray } from "k6/data";

import http from "k6/http";

export const options = { vus: 1, duration: "1m" };

// Reading test date from data.json
const data = new SharedArray("Flights", function() { return JSON.parse(open('./data.json')).flights; });

let flightFrom = data[0];
let flightTo = data[0];

// Reserve Page
export default function main() {
  let response;

  group("Reserve - https://blazedemo.com/reserve.php", function () {
    response = http.post(
      "https://blazedemo.com/reserve.php",
      {
        fromPort: flightFrom ,
        toPort: flightTo,
      },
      {
        headers: {
          accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
          "content-type": "application/x-www-form-urlencoded",
          dnt: "1",
          origin: "https://blazedemo.com",
          "sec-ch-ua": '"Chromium";v="91", " Not;A Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
        },
      }
    );
    sleep(2);
    
  });

  // Checking response code
  check(response, {
    'is status 200': (r) => r.status === 200,
  });

  // Extracting information such as Flight, Price and Airline Name
  const pageResponse  =  response.body;
  const getFlight = /<input type="hidden" value="(.+?)" name="(.+?)">/g;
  const matches = pageResponse.matchAll(getFlight);
  
  let flightID = [];

  // Looping thru the matches
  for (const match of matches){
      flightID.push(match[1]);
  }

  // Purchase page  
  group("Purchase - https://blazedemo.com/purchase.php", function () {
    response = http.post(
      "https://blazedemo.com/purchase.php",
      {
        flight: flightID[0],
        price: flightID[1],
        airline: flightID[2],
        fromPort: flightFrom,
        toPort: flightTo,
      },
      {
        headers: {
          accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
          "content-type": "application/x-www-form-urlencoded",
          dnt: "1",
          origin: "https://blazedemo.com",
          "sec-ch-ua": '"Chromium";v="91", " Not;A Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
        },
      }
    );
    sleep(2);
  });

  // Checking the response code
  check(response, {
    'is status 200': (r) => r.status === 200,
  });

  // Confirmation Page
  group("Confirmation - https://blazedemo.com/confirmation.php", function () {
    response = http.post(
      "https://blazedemo.com/confirmation.php",
      {
        _token: "",
        inputName: "Ram",
        address: "123%20Main%20Rd",
        city: "Centerville",
        state: "FL",
        zipCode: "9001",
        cardType: "visa",
        creditCardNumber: "1234567890123456",
        creditCardMonth: "11",
        creditCardYear: "2025",
        nameOnCard: "Ram",
      },
      {
        headers: {
          accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
          "accept-encoding": "gzip, deflate, br",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "max-age=0",
          "content-type": "application/x-www-form-urlencoded",
          dnt: "1",
          origin: "https://blazedemo.com",
          "sec-ch-ua": '"Chromium";v="91", " Not;A Brand";v="99"',
          "sec-ch-ua-mobile": "?0",
          "sec-fetch-dest": "document",
          "sec-fetch-mode": "navigate",
          "sec-fetch-site": "same-origin",
          "sec-fetch-user": "?1",
          "upgrade-insecure-requests": "1",
        },
      }
    );
  });
  
  // Checking the response code
  check(response, {
    'is status 200': (r) => r.status === 200,
  });
}