const express = require('express')
const router = express.Router()
const mongoose = require('mongoose');
// express 패키지의 Router를 가져온다.

var SeoulParkingmapSchema = mongoose.Schema({
    name:String, // 이름
    address:String, // 구
    dong:String, // 주소
    num:String, //
    opday:String,
    wds:String,
    wde:String,
    hds:String,
    hde:String,
    bpt:String,
    bpf:String,
    latitude:String, // 위도
    longitude:String, // 경도
    code:String
  },
    {
      collection : 'koreaparkinglot'
  });

var KoreaParkinglot = mongoose.model('finalproject', SeoulParkingmapSchema)

router.get('/maptest', function(req, res, next){
  KoreaParkinglot.find({},{_id : 0},function(err,docs){
      if(err) console.log('err');
      var template = `
      <!doctype html>
      <html>
      <head>
        <title>Result</title>
        <meta charset="utf-8">
        <!-- link rel, script src 태그들 관련 unpkg뭐시기로 시작하는거 = Leaflet를 실행하게 하는 코드-->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css" integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==" crossorigin="" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.Default.css" />
        <script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js" integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==" crossorigin=""></script>
        <script src="https://unpkg.com/leaflet.markercluster@1.3.0/dist/leaflet.markercluster.js"></script>
        <style>
        body {
          margin : 0;
          padding : 0;
        }

        #map {
          width : 100%;
          height : 100vh;
        }
        </style>
      </head>
      <body>
       <div id="map"></div>
       <script style ="visibility:none">
         // 여기 밑에부터는 맵 초기좌표, 맵 스타일을 불러오는 태그(copy 관련은 저작권 코드임.)
         const map = L.map('map').setView([37.541, 126.986], 10);
         const attribution =
         '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
         const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
         const tiles = L.tileLayer(tileUrl,{attribution})
         tiles.addTo(map);
         // 여기 밑에부터는 마커 클러스터 기능구현 코드
         var markers = new L.MarkerClusterGroup();
         var greenIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });
        var redIcon = new L.Icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        });


         `

         for(var i=0;i<docs.length;i++){
          if(docs[i]['latitude'] > 0 && docs[i]['longitude'] > 0 && docs[i]['code'] == 1){
            template += `markers.addLayer(
              L.marker([${docs[i]['latitude']},
              ${docs[i]['longitude']}],
              {icon: greenIcon}
              )
            .bindPopup("<a href='/map/tmap?lat1=${docs[i]['latitude']}&lon1=${docs[i]['longitude']}' target='_blank'>이름 : ${docs[i]['name']} </a> <br> 기본시간 : ${docs[i]['bpt']}분 <br> 기본요금 : ${docs[i]['bpf']}원"));`
          }
          if(docs[i]['latitude'] > 0 && docs[i]['longitude'] > 0 && docs[i]['code'] == 2){
          template += `markers.addLayer(L.marker([${docs[i]['latitude']}, ${docs[i]['longitude']}], {icon: redIcon})
           .bindPopup("<a href='/map/tmap?lat1=${docs[i]['latitude']}&lon1=${docs[i]['longitude']}' target='_blank'>이름 : ${docs[i]['name']} </a>"));`
          }


         }

         template+=`
         map.addLayer(markers);
         <!-- 지도 내 현재위치 구현 코드 --!>
         map.locate({enableHightAccuracy: true});
         map.on('locationfound', e => {
             const coords = [e.latlng.lat, e.latlng.lng];
             const marker = L.marker(coords);
             marker.bindPopup('당신이 현재있는 위치입니다.');
             map.addLayer(marker);
             var circle = L.circle([e.latlng.lat, e.latlng.lng], {
                   color: 'red',
                   fillColor: '#f03',
                   fillOpacity: 0.5,
                   radius: 500
               }).addTo(map);
             console.log(coords);
         });
      </script>
     </body>
     </html>
    `;
      res.end(template);

    })

});


router.get('/maptest2', async function(req, res, next){
    let dong  = req.query.dong;
    let data  = "";
    if (dong) {
      console.log(dong)
      data = await KoreaParkinglot.find({"dong" : {$regex: ".*" + dong + ".*"}},{_id : 0})

    } else {
      data = await KoreaParkinglot.find({},{_id : 0});
    }

    var template = `
    <!doctype html>
    <html>
    <head>
      <title>Result</title>
      <meta charset="utf-8">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.1/dist/leaflet.css" integrity="sha512-Rksm5RenBEKSKFjgI3a41vrjkw4EVPlJ3+OiI65vTjIdo9brlAacEuKOiQ5OFh7cOI1bkDwLqdLw3Zg0cRJAAQ==" crossorigin="" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster@1.3.0/dist/MarkerCluster.Default.css" />
      <script src="https://unpkg.com/leaflet@1.3.1/dist/leaflet.js" integrity="sha512-/Nsx9X4HebavoBvEBuyp3I7od5tA0UzAxs+j83KgC8PU0kgB4XiK4Lfe4y4cgBtaRJQEIFCW+oC506aPT2L1zw==" crossorigin=""></script>
      <script src="https://unpkg.com/leaflet.markercluster@1.3.0/dist/leaflet.markercluster.js"></script>
      <link rel="stylesheet" href="/stylesheets/leaflet.css" >
    </head>
    <body>
      <div id="map"></div>
      <script style ="visibility:none">
        const map = L.map('map').setView([37.27538, 127.05488], 7);
        const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        const tiles = L.tileLayer(tileUrl,{attribution})
        tiles.addTo(map);
        <!-- 여기 밑에서부터는 마커클러스터 구현 코드 --!>
        var markers = new L.MarkerClusterGroup();
        var greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      var redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
        `
        for(var i=0;i<data.length;i++){
          if(data[i]['latitude'] > 0 && data[i]['longitude'] > 0 && data[i]['code'] == 1){
            template += `markers.addLayer(L.marker([${data[i]['latitude']}, ${data[i]['longitude']}], {icon: greenIcon})
            .bindPopup("<a href='/map/tmap?lat1=${data[i]['latitude']}&lon1=${data[i]['longitude']}' target='_blank'>이름 : ${data[i]['name']} </a> <br> 기본시간 : ${data[i]['bpt']}분 <br> 기본요금 : ${data[i]['bpf']}원"));`
          }
          if(data[i]['latitude'] > 0 && data[i]['longitude'] > 0 && data[i]['code'] == 2){
            template += `markers.addLayer(L.marker([${data[i]['latitude']}, ${data[i]['longitude']}], {icon: redIcon})
            .bindPopup("<a href='/map/tmap?lat1=${data[i]['latitude']}&lon1=${data[i]['longitude']}' target='_blank'>이름 : ${data[i]['name']} </a>"));`
          }
        }

        template+=`
        map.addLayer(markers);
        console.log(markers);
      </script>
    </body>
    </html>
    `;
    res.end(template);

    // })

});



router.get('/tmap', async function(req, res, next) {

  let {lat1, lon1} = req.query;

  res.render('tmap', {
    'lat1'  : lat1,
    'lon1'  : lon1
  });
});


module.exports = router;
