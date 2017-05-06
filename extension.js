const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Slider = imports.ui.slider;
const Clutter = imports.gi.Clutter;
const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Util = imports.misc.util;
const Mainloop = imports.mainloop;

let text;
let install_event = null;
let save = false;
let streams = [];
let freqInfo = null;
let cpufreq_output = null;
let cmd = null;

const Wattery = new Lang.Class({
    Name: 'Wattery',
    Extends: PanelMenu.Button,

    _init: function () {
        this.parent (0.0, "Watt drain indicator", false);
        this.statusLabel = new St.Label ({text: "Icono \u26A0", y_expand: true, y_align: Clutter.ActorAlign.CENTER});
        let _box = new St.BoxLayout();
        _box.add_actor(this.statusLabel);
        this.actor.add_actor(_box);
        
    },

});

let wattery;

function init () {
}

function enable () {
  wattery = new Wattery;
  // addToStatusArea se refiere a que lo va a añadir a la parte del panel
  // donde esta el estado de las cosas, no en el desplegablel de la esquina.
  Main.panel.addToStatusArea('wattery-indicator', wattery);
}

function disable () {
  wattery.destroy();
  Mainloop.source_remove(event);
  wattery = null;
}
