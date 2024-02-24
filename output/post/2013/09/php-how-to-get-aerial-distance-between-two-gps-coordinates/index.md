---
title: "PHP: How to get aerial distance between two GPS coordinates"
date: "2013-09-22"
categories: 
  - "software"
---

I wanted to calculate the distance between two GPS coordinates in Kilometres  
There's an algorithm called "Haversine Great Circle Distance" that does just that.  
Here's a PHP implementation of the Great Circle Distance algorithm:  
`    function haversineGreatCircleDistance($latitudeFrom, $longitudeFrom, $latitudeTo, $longitudeTo) {   // convert from degrees to radians   $latFrom = deg2rad($latitudeFrom);   $lonFrom = deg2rad($longitudeFrom);   $latTo = deg2rad($latitudeTo);   $lonTo = deg2rad($longitudeTo);      // calculate delta   $latDelta = $latTo - $latFrom;   $lonDelta = $lonTo - $lonFrom;      $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) + cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));      return $angle * 6371; // earth radius in km   }    `
