import localDataManager from '../js/localDataManager';

export default {
  buttons: function(issue){
    const btn_to_approve = `<a class="btn-floating btn-issue waves-effect waves-light blue" onclick="adminApprove('${issue.token}','0')"><i class="material-icons right">remove_circle</i></a>\n`;
    const btn_approve = `<a class="btn-floating btn-issue waves-effect waves-light green" onclick="adminApprove('${issue.token}','1')"><i class="material-icons center">check_circle</i></a>\n`;
    const btn_refuse = `<a class="btn-floating btn-issue waves-effect waves-light red" onclick="adminApprove('${issue.token}','2')"><i class="material-icons center-align">delete</i></a>\n`;
    const btn_edit = `<a class="btn-floating btn-issue waves-effect waves-light blue" onclick="startForm('${issue.token}')"><i class="material-icons center">edit</i></a>\n`;
    var btns = "";
    if (localDataManager.isAdmin()) {
      if (issue.approved == "0") {
        btns = btn_approve + btn_refuse + btn_edit;
      } else if (issue.approved == "1") {
        btns = btn_to_approve;
      } else if (issue.approved == "2") {
        btns = btn_approve + btn_to_approve;
      }
    }
    return `
     ${btns}
     <a title="Observations similaires" target="_blank" class="waves-effect waves-light btn-floating btn-issue" href="${issue.mosaic}"><i class="material-icons center">view_list</i></a>
     <a title="Lien à partager" class="waves-effect waves-light btn-floating btn-issue" href="${issue.permLink}"><i class="material-icons center">share</i></a>
     <a title="Voir sur la carte" class="waves-effect waves-light btn-floating btn-issue" onclick="centerOnIssue('${issue.token}')"><i class="material-icons center">map</i></a>
     <a href="#!" title="Fermer" class="modal-close grey waves-effect waves-light btn-floating btn-issue" onclick="closeIssue()"><i class="material-icons center">close</i></a>
    `
  },
  body: function (issue) {
    return `
<div class="row">
  <div class="col s12 center-align">
     </div>
  <div class="col s12">
    <div class="left-align">
        <img class="materialboxed center-align" src="${issue.img}">
        <h6 class="center-align valign-wrapper">
            ${(issue.approved == 0) ? '<i class="material-icons">new_releases</i> Ce signalement sera vérifié prochainement par un modérateur' : ''}
            ${(issue.status == 1) ? '<i class="material-icons">done_all</i> Ce signalement a été pris en compte et le problème corrigé !' : ''}
            ${(issue.status == 2) ? '<i class="material-icons">info</i> Ce signalement sera prochainement résolu.' : ''}
            ${(issue.status == 3) ? '<i class="material-icons">hourglass_empty</i> Ce signalement est en cours de résolution.' : ''}
            ${(issue.status == 4) ? '<i class="material-icons">done</i> Ce signalement semble être résolu.' : ''}
            ${(localDataManager.getTokenSecretId(issue.token) != undefined) ? '<i class="material-icons">person</i> J\'ai fait ce signalement' : ''}
        </h6>
          <p><b>Référence de suivi :</b> <a href="${issue.permLink}">${issue.token}</a> | <a title="Observations similaires" target="_blank" href="${issue.mosaic}">Obversations similaires</a></p>

          <p>
              <b>Catégorie :</b><br>
              ${issue.categorie_str}
          </p>
          <p>
              <b>Date :</b><br>
              ${issue.date_obj.toLocaleString('fr')}
          </p>
          <p>
              <b>Remarque :</b><br>
              ${issue.comment}
              <br><blockquote>${issue.explanation}</blockquote>
          </p>
          <p>
              <b>Localisation :</b><br>
              ${issue.address}
          </p>
      </div>
  </div>

`
  }
}
