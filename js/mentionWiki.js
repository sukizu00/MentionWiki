mentionWiki = function (param) {
  var defaulParam = {
    selector : ".mentionWrapper", 
    wikiUrl : "https://wiki.consid.vn/",
    startString: '#',
    endString: ';'
  }
  param = Object.assign(defaulParam, param);
  var element = document.querySelector(param.selector);
  // element là wrapper
  this.curElement = element.querySelector(".mentionEdit");

  this.panel = element.querySelector(".mentionPanel"); //this.curElement.parentElement.querySelector(".mentionPanel");
  
  for (var key in param) this[key] = param[key];

  this.curElement.addEventListener("keyup", (event) => {
    var value = event.target.value;
    var phanCuoi = value.split(this.endString).pop();
    var tmp = phanCuoi.split(this.startString);
    if (tmp.length > 1) {
      this.showPanel();
      var keyword = tmp[tmp.length - 1].replace(/\s/gi, "+");
      // console.log(keyword);
      fetch(
        this.wikiUrl +
          "w/api.php?action=query&list=allpages&format=json&apprefix=" +
          keyword
      )
        .then((response) => response.json())
        .then((data) => this.renderResults(data));
    } else {
      this.hidePanel();
    }
  });

  addMeToInput = function (elem) {
    var keyword = elem.innerHTML;
    console.log(keyword)
    var mentionWrapper = elem.closest('.mentionWrapper');
    var input = mentionWrapper.querySelector(".mentionEdit");
    var startString = mentionWrapper.mentionWikiObject.startString;
    var endString = mentionWrapper.mentionWikiObject.endString;
    var oldValue = input.value;
    var newValue = changeValue(oldValue, keyword, startString, endString);    
    input.value = newValue;
    input.focus();
    mentionWrapper.querySelector(".mentionPanel").classList.add('mentionWikiHide');
  };

  element.mentionWikiObject = this;

  return this;
};

mentionWiki.prototype.hidePanel = function () {
  this.panel.classList.add("mentionWikiHide");
};
mentionWiki.prototype.showPanel = function () {
  this.panel.classList.remove("mentionWikiHide");
};

mentionWiki.prototype.renderResults = function (data) {
  var tmp = data.query.allpages;
  var mangMoi = [];
  var html_ul = "";
  console.log("--------------------");
  console.log(tmp)
  for (var i = 0; i < tmp.length; i++) {
    html_ul =
      html_ul + '<li onClick="addMeToInput(this)">' + tmp[i].title + "</li>";
    mangMoi.push(tmp[i].title);
  }
  this.panel.innerHTML = html_ul;
};

function changeValue(oldValue, keyword, startString, endString) {
  var a = oldValue.lastIndexOf(startString);
  var b = oldValue.slice(0,a);
  return b + startString + keyword + endString;  
}





