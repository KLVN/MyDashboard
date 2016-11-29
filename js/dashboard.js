////////// Data //////////
var DashboardData = {
  links: [
    {name: "Stud.IP", url: "https://e-learning.tu-harburg.de/studip/index.php?again=yes"},
    {name: "Mail", url: "https://webmail.tu-harburg.de/horde/imp/dynamic.php?page=mailbox#mbox:SU5CT1g"},
    {name: "SOS", url: "https://www.service.tuhh.de/sos/"},
    {name: "Prüfungstermine", url: "https://intranet.tuhh.de/stud/pruefung/index.php3"},
    {name: "Termine & Fristen", url: "https://www.tuhh.de/tuhh/studium/studieren/termine-fristen.html"},
    {name: "Intranet", url: "https://intranet.tuhh.de/editor/index.php"},
    {name: "Wetter", url: "http://www.wetteronline.de/wetter/hamburg/harburg"},
    {name: "Lageplan", url: "https://www.tuhh.de/tuhh/uni/lageplan/campusplan.html"}
  ],
  lectures: [
    {semester: 2, name: "OOP", date: "09.02.2017", duration: 10},
    {semester: 3, name: "TI", date: "14.02.2017", duration: 10},
    {semester: 2, name: "Logik", date: "17.02.2017", duration: 7},
    {semester: 3, name: "Mathe 3", date: "23.02.2017", duration: 14},
    {semester: 1, name: "LA", date: "24.02.2017", duration: 10},
    {semester: 1, name: "FP", date: "01.03.2017", duration: 7},
    {semester: 2, name: "SE", date: "07.03.2017", duration: 7},
    {semester: 3, name: "IS", date: "10.03.2017", duration: 10},
    {semester: 1, name: "PP", date: "14.03.2017", duration: 7},
    {semester: 3, name: "CN", date: "23.03.2017", duration: 12},
    {semester: 2, name: "MA", date: "31.03.2017", duration: 14}
  ] 
}

////////// Moment.js //////////
moment.locale("de");
var currentweek = moment().isoWeek();

function formatDate(unformatted) {
  return new Date(moment(unformatted, "DD.MM.YYYY").format("M/DD/YYYY"));
}

function truncateDate(unformatted) {
  return moment(unformatted, "DD.MM.YYYY").format("D.M");
}

////////// Vue //////////
// KW
var vueNavbar = new Vue({
  el: '#navbar',
  data: {
    week: currentweek
  }
});

// Links
var vueURLs = new Vue({
  el: '#links',
  data: DashboardData
});

////////// Google Charts //////////
google.charts.load("current", {packages:["timeline"], 'language': 'de'});
google.charts.setOnLoadCallback(drawChart);

// draw "today" line
function markToday (div, rows){
  $('#'+div+' text:contains("Heute")').css('font-size','11px').attr('fill','#A6373C').prev().first().attr('height',rows*41+'px').attr('width','1px').attr('y','0');
}

function drawChart() {
  var container = document.getElementById('chart_div');
  var chart = new google.visualization.Timeline(container);
  var dataTable = new google.visualization.DataTable();
  var numRows = DashboardData.lectures.length;
  dataTable.addColumn({ type: 'string', id: 'Semester' });
  dataTable.addColumn({ type: 'string', id: 'Name' });
  dataTable.addColumn({ type: 'date', id: 'Start' });
  dataTable.addColumn({ type: 'date', id: 'End' });
  dataTable.addRows([
    ['', 'Heute', new Date(), new Date()],
    ['', 'Anmeldezeitraum', formatDate("05.12.2016"), formatDate("18.12.2016")],
    ['', 'Ferien', formatDate("24.12.2016"), formatDate("8.01.2017")]
  ]);
  
  // so proud of dis ( ͡° ͜ʖ ͡°)
  for(i in DashboardData.lectures) {
    dataTable.addRows([['S' + DashboardData["lectures"][i]["semester"],
      DashboardData["lectures"][i]["name"] + " (" + truncateDate(DashboardData["lectures"][i]["date"]) + ")",
      formatDate(moment(formatDate(DashboardData["lectures"][i]["date"])).subtract(DashboardData["lectures"][i]["duration"], 'days')),
      formatDate(DashboardData["lectures"][i]["date"])]]);
  };
  
  var numRows2 = dataTable.getNumberOfRows();
  var chartHeight = numRows2 * 41 + 50;

  var options = {
    height: chartHeight,
    timeline: {
      showRowLabels: false,
      groupByRowLabel: false,
      colorByRowLabel: true
    },
    hAxis: {
      minValue: moment().subtract(5, 'day'),
      maxValue: formatDate("07.04.2017")
    }
  };

  chart.draw(dataTable, options);
  markToday('chart_div', numRows2);

  /*google.visualization.events.addListener(chart, 'onmouseover', function(obj) {
    markToday('chart_div', numRows2);
  });*/
}

$( window ).resize(function() {
  drawChart();
});
