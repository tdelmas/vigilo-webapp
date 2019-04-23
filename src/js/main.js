// Import HTML
import '../index.html';
// import main CSS
import '../css/main.scss';

import $ from 'jquery';
window.$ = $;
import M from 'materialize-css';

// Fix import leaflet with webpack https://github.com/PaulLeCam/react-leaflet/issues/255
/*delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	iconUrl: require('leaflet/dist/images/marker-icon.png'),
	shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});*/


import * as vigilo from './vigilo-api';
import * as vigiloui from './vigilo-ui';
import * as vigiloconfig from './vigilo-config';
import * as issuemap from './issue-map';
import './form';

// Init UI fonction
(async function initUI() {
	// Zone modal
	var current_instance = vigiloconfig.getInstance()==null?'':vigiloconfig.getInstance().name;
	for (var i in vigiloconfig.INSTANCES) {
		$("#modal-zone .modal-content .collection").append(`<a href="#!" onclick="setInstance('${vigiloconfig.INSTANCES[i].name}')" class="collection-item${(vigiloconfig.INSTANCES[i].name == current_instance ? ' active' : '')}">${vigiloconfig.INSTANCES[i].name}</a>`)
	}
	M.Modal.init($("#modal-zone"));
	if (vigiloconfig.getInstance() == null) {
		M.Modal.getInstance($("#modal-zone")).open();
		return
	} else {

	}


	// Fill category select
	var cats = await vigilo.getCategories();
	for (var i in cats) {
		$("#issue-cat").append(`<option value="${i}">${cats[i]}</option>`)
	}

	M.Tabs.init($("nav .tabs"));
	M.Tabs.getInstance($("nav .tabs")).options.onShow = function () { issuemap.initMap() }
	M.Sidenav.init($("#mobile-menu"));

	M.Modal.init($("#modal-issue"));
	M.Modal.init($("#modal-form"));




	const WE_ARE_ON_A_MOBILE = typeof orientation !== 'undefined' || navigator.userAgent.toLowerCase().indexOf('mobile') >= 0;

	if (!WE_ARE_ON_A_MOBILE) {
		M.Datepicker.init($("#issue-date"), {
			container: 'body',
			firstDay: 1,
			format: 'dd mmm yyyy',
			i18n: {
				months: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
				monthsShort: ['janv.', 'févr.', 'mars', 'avril', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
				weekdays: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
				weekdaysShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
				weekdaysAbbrev: ['D', 'L', 'Ma', 'Me', 'J', 'V', 'S'],
				cancel: "Annuler",

			},
			autoClose: true,
			onSelect: () => {
				M.Timepicker.getInstance($("#issue-time")).open()
			}
		});
		M.Timepicker.init($("#issue-time"), {
			container: 'body',
			autoClose: true,
			twelveHour: false,
			i18n: {
				'cancel': 'Annuler',
				'done': 'ok'
			},
			onCloseEnd: () => {
				$("#issue-cat").focus()
			}
		});
		M.FormSelect.init($("#issue-cat"))
	} else {
		$("#issue-cat").addClass('browser-default')
		$("#issue-date").attr('type', 'date');
		$("#issue-time").attr('type', 'time');
	}



	// Preview picture
	$("#modal-form input[type=file]").change(function () {
		var input = this;
		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#picture-preview').attr('src', e.target.result);
			}

			reader.readAsDataURL(input.files[0]);
		}
	})

	$(window).scroll(() => {
		if (($(window.document.body).height() - $(window).height() - $(window).scrollTop()) < 10) {
			displayIssues(10)
		}
	})
	displayIssues(10)
})()


/**
 * Functions for issues list
 */
let offset = 0;
async function displayIssues(count) {
	var issues = await vigilo.getIssues()
	issues = issues.slice(offset, offset + count);
	offset += issues.length;
	issues.forEach((issue) => {
		$(".issues .cards-container").append(vigiloui.issueCard(issue))
	})
}

async function viewIssue(token) {
	var modal = M.Modal.getInstance($("#modal-issue")[0]);
	var issues = await vigilo.getIssues();
	var issue = issues.filter(item => item.token == token)[0];
	$("#modal-issue").empty().append(vigiloui.issueDetail(issue));
	M.Materialbox.init($("#modal-issue .materialboxed"));
	modal.open()
}
window.viewIssue = viewIssue

window.setInstance = vigiloconfig.setInstance;