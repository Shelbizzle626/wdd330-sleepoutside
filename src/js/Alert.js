/* 
1. Create an Alert.js file (module). In the file add a class called Alert and export it as default. 

3. Your class should read the contents of the alerts.js file, and if it finds anything it should create a 
<section class="alert-list> element then  loop through the results and build a <p> for each alert and 
apply the background and foreground colors to it specified in the alert.

4. Once built the <section> should be prepended to the main element on the index page.
*/

export default class Alert {
    constructor(dataSourceUrl = "./json/alerts.json") {
      this.dataSourceUrl = dataSourceUrl;
    }
  
    async render() {
      try {
        const response = await fetch(this.dataSourceUrl);
        if (!response.ok) throw new Error("Failed to load alerts");
        
        const alertsData = await response.json();
        if (!alertsData.length) return;
  
        const alertsHtml = alertsData.map(alert => 
          `<p style="background-color: ${alert.background}; color: ${alert.color}">${alert.message}</p>`
        ).join("");
  
        const mainElement = document.querySelector("main");
        if (mainElement) {
          mainElement.insertAdjacentHTML("afterbegin", `<section class="alert-list">${alertsHtml}</section>`);
        }
      } catch (error) {
        console.error("Error fetching alerts:", error);
      }
    }
  }