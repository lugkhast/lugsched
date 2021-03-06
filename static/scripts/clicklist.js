
/*
 * clicklist.js: a system for easily creating and manipulating 
 * lists of items
 */

function ClickListButtonData() {
    this.text = "";
    this.onClick = null;
}

function ClickListElement() {
    this.mainText = "";
    this.subText = "";
    this.rightText = "";
    this.button1 = new ClickListButtonData();
    this.button2 = new ClickListButtonData();
}

function ClickList(div) {
    this.div = div;
    this.list = new LinkedList();
    this.emptyText = "";
    this.headerText = "AY 2010-2011, Term 1";

    var headerDiv = document.createElement("div")
    this.headerDiv = headerDiv;
    headerDiv.classList.add("clicklist-header");
    headerDiv.textContent = this.headerText;
    this.div.append(headerDiv);
}

ClickList.prototype.updateEmptyText = function() {
    if (this.list.isEmpty()) {
        this.div.find(".clicklist-empty-text").show();
    } else {
        this.div.find(".clicklist-empty-text").hide();
    }
}

ClickList.prototype.setEmptyText = function(emptyText) {
    var textElem = this.div.find(".clicklist-empty-text");
    if (!textElem) {
        console.error("This ClickList has no empty text");
        return;
    }

    textElem.text(emptyText);
    this.updateEmptyText();
}

ClickList.prototype.setHeaderText = function(headerText) {
    this.headerText = headerText;
}

ClickList.prototype.setSortFunction = function(sortFunc) {
    this.list.setSortFunc(sortFunc);
}

ClickList.prototype.updateItems = function() {
    // Only the last element should have a bottom border, as having two
    // adjacent bottom borders results in a thick, ugly line
    // This also adds the rounded bottom border edges
    this.div.find(".clicklist-item-bottom").removeClass("clicklist-item-bottom");
    this.div.find(".clicklist-item:last").addClass("clicklist-item-bottom");

    // Only the top element should have rounded top edges
    this.div.find(".clicklist-item-top").removeClass("clicklist-item-top")
    this.div.find(".clicklist-item:first").addClass("clicklist-item-top")

    this.div.find(".clicklist-item").hover(function() {
        $(this).addClass("clicklist-item-hover");
    }, function() {
        $(this).removeClass("clicklist-item-hover");
    });
}

ClickList.prototype.orderedAdd = function(element) {
    this.list.orderedAdd(element);
}

ClickList.prototype.createItem = function(element) {
    var item = document.createElement("div");
    item.className = "clicklist-item";
    
    var mainText = document.createElement("div");
    mainText.className = "clicklist-maintext";
    mainText.textContent = element.mainText;
    item.appendChild(mainText);
    
    var rightText = document.createElement("div");
    rightText.className = "clicklist-righttext";
    rightText.textContent = element.rightText;
    mainText.appendChild(rightText);
    
    var subText = document.createElement("div");
    subText.className = "clicklist-subtext";
    subText.textContent = element.subText;
    item.appendChild(subText)
    
    return item;
}

ClickList.prototype.initListItem = function(item, data) {
    // Make sure we have access to jQuery methods
    item = $(item);

    item.attr("mainText", data.mainText);
    item.find("input:first").click(data.button1.onClick);
    item.find("input:last").click(data.button2.onClick);
    item.attr("id", null);
}

ClickList.prototype.add = function(element) {
    if (!element.mainText) {
        console.error("Missing mainText");
        return;
    }

    this.list.add(element);

    var item = this.createItem(element);
    this.div.append(item);

    this.initListItem(item, element);
    this.updateEmptyText();
    this.updateItems();

    // Return the DOM element, so effects can be applied if desired.
    return item;
}


ClickList.prototype._fullUpdateTraversalFunc = function(element, list) {
    var item = list.createItem(element);
    list.initListItem(item, element);
    list.div.append(item);
}
/*
 * An easy but inefficient way to update the list
 */
ClickList.prototype.fullUpdate = function() {
    this.div.find(".clicklist-item").remove();    
    this.list.traverse(this._fullUpdateTraversalFunc, this);
    this.updateItems();
    this.updateEmptyText();
}

ClickList.prototype._rmCmpFunc = function(a, b) {
    var match = true;
    if (a.mainText && b.mainText && (a.mainText != b.mainText)) {
        match = false;
    }
    if (a.subText && b.subText && (a.subText != b.subText)) {
        match = false;
    }
    if (a.rightText && b.rightText && (a.rightText != b.rightText)) {
        match = false;
    }
    return match;
}

ClickList.prototype.remove = function(element) {
    this.list.removeVal(element, this._rmCmpFunc);
    this.fullUpdate();
}

ClickList.prototype.removeAll = function() {
    this.list = new LinkedList();
    this.fullUpdate();
}


/*******************************************************************
 * ClickListGroup and related code
 ******************************************************************/

function ClickListGroupItem(list, headerText) {
    var div = document.createElement("div");
    div.textContent = headerText;
    div.classList.add("clicklist-header");

    this.header = div;
    this.list = list;
}

function ClickListGroup(div) {
    this.div = div;
    this.groupItems = [];
}

ClickListGroup.prototype.add = function(list, headerText) {
    var item = new ClickListGroupItem(list, headerText);
    this.groupItems.add(item);

    this.div.append(item.header);
    this.div.append(item.list.div);
}

