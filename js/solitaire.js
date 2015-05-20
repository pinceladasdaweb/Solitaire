/*jslint browser: true*/
/*global define, module, exports*/
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.Solitaire = factory();
    }
}(this, function () {
    "use strict";

    var Solitaire = function () {
        if (!this || !(this instanceof Solitaire)) {
            return new Solitaire();
        }

        this.endpoint = 'tweet.php';
        this.body     = document.querySelector('body');
        this.form     = document.querySelector('#post-tweet');
        this.status   = document.querySelector('#tweet');
        this.state    = document.querySelector('.feedback');
        this.defaults = {};

        this.tweet();
    };

    Solitaire.init = function () {
        return new Solitaire();
    };

    Solitaire.prototype = {
        post: function (path, data, callback) {
            var xhttp = new XMLHttpRequest(),
                self  = this;

            xhttp.open('POST', path, true);
            xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4) {
                    if (this.status >= 200 && this.status < 400) {
                        var response = '';
                        try {
                            response = JSON.parse(this.responseText);
                        } catch (err) {
                            response = this.responseText;
                        }
                        callback.call(self, response);
                    } else {
                        throw new Error(this.status + " - " + this.statusText);
                    }
                }
            };
            xhttp.send(data);
            xhttp = null;
        },
        param: function (obj) {
            var encodedString = '',
                prop;

            for (prop in obj) {
                if (obj.hasOwnProperty(prop)) {
                    if (encodedString.length > 0) {
                        encodedString += '&';
                    }
                    encodedString += encodeURI(prop + '=' + obj[prop]);
                }
            }

            return encodedString;
        },
        createEls: function (name, props, text) {
            var el = document.createElement(name), p;
            for (p in props) {
                if (props.hasOwnProperty(p)) {
                    el[p] = props[p];
                }
            }
            if (text) {
                el.appendChild(document.createTextNode(text));
            }
            return el;
        },
        hideMessages: function () {
            this.status.addEventListener('focus', function () {
                while (this.state.hasChildNodes()) {
                    this.state.removeChild(this.state.lastChild);
                }
            }.bind(this), false);
        },
        feedback: function (res) {
            var status  = res.status,
                message = res.message,
                p;

            this.form.dataset.status = 'ready';

            if (status === 'success') {
                p = this.createEls('p', {className: 'bg-success text-success'}, message);

                this.status.value = '';
                document.querySelector('.chars-length').innerHTML = 140;
            } else {
                p = this.createEls('p', {className: 'bg-danger text-danger'}, message);
            }

            this.state.appendChild(p);

            this.body.classList.remove('loading');
            this.hideMessages();
        },
        tweet: function () {
            this.form.addEventListener('submit', function (e) {
                e.preventDefault();

                if (this.status.value === '' || this.form.dataset.status === 'busy') {
                    return;
                }

                this.form.dataset.status = 'busy';
                this.body.classList.add('loading');

                this.defaults = {
                    tweet: this.status.value
                };

                this.post(this.endpoint, this.param(this.defaults), this.feedback);
            }.bind(this), false);
        }
    };

    return Solitaire;
}));