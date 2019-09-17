var imgSrc = $('td.c3').eq(0).find('img').attr('src');
var name = $('td.c3').eq(1).text();
var sex = $('td.c3').eq(2).text();
var phone = $('td.c3').eq(3).text().slice(0,11);
var qx = $('td.c3').eq(8).text();
var note = $('td.c3').eq(9).next().text();
