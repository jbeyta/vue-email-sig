import Vue from 'vue';
import { format } from 'url';
import { setTimeout } from 'timers';

(function () {
	'use strict';
	const sigEl = document.querySelector('#sigmaker');

	if (sigEl) {
		Vue.filter('phoneDots', function (value) {
			let justNumbs = value.replace(/\D/g, '');
			let limitedNumbs = justNumbs.substr(0, 10);
			let formatted = limitedNumbs.replace(/(\d{3})(\d{3})(\d{4})/, '$1.$2.$3');
			if(formatted.length == 12) {
				return formatted;
			}
		});

		Vue.filter('cleanPhone', function (value) {
			return value.replace(/\D/g, '');
		});

		Vue.filter('upperCaseIt', function (value) {
			return value.toUpperCase();
		});

		new Vue({
			el: '#sigmaker',
			data: {
				copied: false,
				name: '',
				title: '',
				cell_phone: '',
				direct_phone: '',
				extension: '',
				alt_phone: '',
				fax: '',
				show_fax: false,
				email: '',
				office_phone: '',
				show_office_phone: false,
				address: '',
				which_office: '',
				nmls: '',
				tccunmls: '',
				addressOpts: {
					downtown: {
						address: '807 8th St., Ste. 100<br>Wichita Falls, TX 76301',
						phone: '940.851.4000',
						fax: '940.851.4080'
					},
					southwest: {
						address: '4019 Southwest Parkway<br>Wichita Falls, TX 76308',
						phone: '940.851.4000',
						fax: '940.851.4081'
					},
					sheppard: {
						address: '3800 Sheppard Access Road<br>Wichita Falls, TX 76306',
						phone: '940.851.4000',
						fax: '940.851.4080'
					},
				},
				website: 'texomacu.com',
				domain: window.location.protocol + '//' + window.location.host + window.location.pathname
			},
			mounted: function() {
				this.unescape();
				this.swapAddress('tx');
			},
			methods: {
				selectCopy: function() {
					const element = document.querySelector('.esig-mother');

					//Before we copy, we are going to select the text.
					// var text = document.getElementById(element);
					let selection = window.getSelection();
					let range = document.createRange();
					range.selectNodeContents(element);
					selection.removeAllRanges();
					selection.addRange(range);
					//add to clipboard.
					document.execCommand('copy');

					this.copied = true;
					let self = this;

					setTimeout(function(){
						self.copied = false;
					}, 4000);
				},
				swapAddress: function(){
					if (this.which_office) {
						this.address = this.addressOpts[this.which_office].address;
						this.office_phone = this.addressOpts[this.which_office].phone;
						this.fax = this.addressOpts[this.which_office].fax;
					}
				},
				reset: function(){
					this.name = '';
					this.title = '';
					this.cell_phone = '';
					this.extension = '';
					this.alt_phone = '';
					this.fax = '';
					this.show_fax = false;
					this.email = '';
					this.office_phone = '';
					this.show_office_phone = false;
					this.which_office = '';
					this.website = 'texomacu.com';
					this.nmls = '';
					this.tccunmls = '';
				},
				unescape: function(){
					let preview = document.querySelector('.esig-preview');
					if (preview) {
						let sig_html = preview.innerHTML;
						let code_mother = document.querySelector('.code-mother');
						code_mother.innerHTML = sig_html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
					}
				}
			},
			updated: function(){
				// this.unescape();
			},
			computed: {
				cleanPhone: function(phone){
					const cleanPhone = phone.replace(/\D/g, '');
					return cleanPhone;
				}
			}
		});	
	}

}());