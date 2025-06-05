(function() {
    'use strict';

    angular
    .module('pomodoro')
    .factory('Notifier', Notifier);

    /**
     * @ngdoc factory
     * @name pomodoro.factory: Notifier
     * @requires '$window', '$timeout'
     * @description Handles creating audio and desktop notifications,
     * messages can be set on the desktop notification
     * @author Peter Redmond https://github.com/httpete-ire
     *
     * ngInject
     */
    function Notifier($window, $timeout) {

        var notifierSettings = {
            title: 'Tomate',
            tag: 'tomate',
            dismiss: 3000,
            sound: './assets/alarm.mp3',
            active: './assets/active-clock.png',
            break: './assets/break-clock.png'
        };

        /**
         * the inner object that handles creating
         * audio and desktop notifications
         *
         * @param  {Object} opts : options object
         */
        function _notifier(opts) {
            /*jshint validthis:true */
            this.settings = opts || {};
            this.permission = false;
            this._notification = null;
            this._audio = new Audio(notifierSettings.sound);
        }

        /**
         * check to see if the browser supports desktop notifications
         */
        _notifier.prototype.isSupported = function() {
            return 'Notification' in $window;
        };

        /**
         * set the permissions on the Notification object
         */
        _notifier.prototype.grantPermission = function() {

            var self = this;

            Notification.requestPermission(function(permission) {
                // set the permission property to true or false
                self.permission = (permission === 'granted');
            });
        };

        /**
         * create a new instance of the Notification object and set
         * properties on it, also bind listeners for 'close'
         * and 'click' events
         *
         * @param {String} msg : Message to output to notification
         */
_notifier.prototype.setNotification = function(msg, icon) {

            var self = this;

            // set notification
            var n = this._notification = new Notification(notifierSettings.title, {
                body: msg,
                tag: notifierSettings.tag,
                icon: notifierSettings[icon]
            });

            // close notification after a timer
            this._notification.onshow = function() {
                // call the close method and bind the value of this to
                // be the notifier
                $timeout(n.close.bind(n), notifierSettings.dismiss);
            };

            // stop the alarm when notification is clicked
            this._notification.onclose = stopAudio;
            this._notification.onclick = stopAudio;

            // pause the alarm and reset it
            function stopAudio() {
                self._audio.pause();
                self._audio.currentTime = 0;
            }

        };

        /**
         * play the audio
         */
        _notifier.prototype.playSound = function() {
            this._audio.play();
        };

        /**
         * return if the user has granted permission for notifications
         *
         * @return {boolean}
         */
        _notifier.prototype.getPermission = function() {
            return this.permission;
        };

        // return constructor for Notifier
        return _notifier;
    }

})();
