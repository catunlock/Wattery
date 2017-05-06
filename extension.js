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

let wattStream;
let event = null;

const Wattery = new Lang.Class({
    Name: 'Wattery',
    Extends: PanelMenu.Button,

    _init: function () {
        this.parent (0.0, "Watt drain indicator", false);
        
        strWatts = this._get_watts();        

        this.statusLabel = new St.Label ({text: strWatts+" W", y_expand: true, y_align: Clutter.ActorAlign.CENTER});
        let _box = new St.BoxLayout();
        _box.add_actor(this.statusLabel);
        this.actor.add_actor(_box);

        this._add_event();
    },

    _get_watts: function() {
        let f = Gio.File.new_for_path('/sys/class/power_supply/BAT0/current_now');
        wattStream = new Gio.DataInputStream({ base_stream: f.read(null) });

        strWatts = this._read_line (wattStream);
        
        watts = parseInt(strWatts);

        return (watts/100000).toFixed(2);
    },
    
     _add_event: function () {
        event = GLib.timeout_add_seconds (0, 1, Lang.bind (this, function () {
            this._update();
            return true;
        }));
        
    },

    _update: function() {
      strWatts = this._get_watts(); 
      this.statusLabel.set_text (strWatts+" W");
    },

    _read_line: function (dis) {
        let line;
        try {
            dis.seek (0, GLib.SeekType.SET, null);
            [line,] = dis.read_line (null);
        } catch (e) {
            print ("Error: ", e.message);
            this._init_streams ();
        }
        return line;
    },

});


// LOAD PART
// =========


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
