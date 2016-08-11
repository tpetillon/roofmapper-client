'use strict';

var defined = require('defined');

function Session() {
    this._buildings = [];
    this._currentIndex = -1;
    this._taggedBuildingCount = 0;
    this._changesetId = undefined;
}

Object.defineProperties(Session.prototype, {
    currentIndex : {
        get : function() {
            return this._currentIndex;
        },
        set : function(value) {
            if (value !== this._currentIndex && value >= 0 && value < this._buildings.length) {
                this._currentIndex = value;
            }
        }
    },
    currentBuilding : {
        get : function() {
            if (this._currentIndex >= 0) {
                return this._buildings[this._currentIndex];
            } else {
                return undefined;
            }
        }
    },
    buildingCount : {
        get : function() {
            return this._buildings.length;
        }
    },
    taggedBuildingCount : {
        get : function() {
            return this._taggedBuildingCount;
        }
    },
    changesetId : {
        get : function() {
            return this._changesetId;
        },
        set : function(value) {
            this._changesetId = value;
        }
    }
});

Session.prototype.addBuilding = function(building, setAsCurrentIndex) {
    this._buildings.push(building);
    
    if (setAsCurrentIndex === true) {
        this._currentIndex = this._buildings.length - 1;
    }
};

Session.prototype.getBuilding = function(index) {
    return this._buildings[index];
}

Session.prototype.getCurrentBuilding = function() {
    if (this._currentIndex !== -1) {
        return this._buildings[this._currentIndex];
    }
    
    return undefined;
}

Session.prototype.setBuildingRoofMaterial = function(building, roofMaterial) {
    var previousRoofMaterial = building.roofMaterial;
    
    building.roofMaterial = roofMaterial;
    
    if (!defined(previousRoofMaterial) && defined(roofMaterial)) {
        this._taggedBuildingCount++;
    } else if (defined(previousRoofMaterial) && !defined(roofMaterial)) {
        this._taggedBuildingCount--;
    }
}

Session.prototype.toOsmChange = function() {
    if (!defined(this._changesetId)) {
        return '';
    }
    
    var changesetId = this._changesetId;
    
    var xml = '';
    
    xml += '<osmChange version="0.6">';
    
    this._buildings.forEach(function(building) {
        xml += building.toOsmChange(changesetId);
    });
    
    xml += '</osmChange>';
    
    return xml;
};

Session.prototype.clearTaggedBuildings = function() {
    this._buildings = this._buildings.filter(function(building) {
        return !defined(building.roofMaterial);
    });
    
    this._currentIndex = this._buildings.length - 1;
    this._taggedBuildingCount = 0;
};

module.exports = Session;