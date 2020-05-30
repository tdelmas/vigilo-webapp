import dataManager from './dataManager';
import errorCard from '../html/error';
import issueCard from '../html/issue-card';
import issueDetail from '../html/issue-detail';
/**
 * Functions for issues list
 */
let offset = 0;
export async function cleanIssues() {
	$("#issues .cards-container").empty();
	offset = 0;
}

export async function displayIssues(count) {
	try {
		var issues = await dataManager.getData();
		issues = issues.slice(offset, offset + count);
		offset += issues.length;
		issues.forEach((issue) => {
			$("#issues .cards-container").append(issueCard(issue))
		})
	} catch (e) {
		$("#issues").empty().append(errorCard(e));
	}

}

export async function viewIssue(token) {
	var side=$("#issue-detail")
	var issues = await dataManager.getData();
	var issue = issues.filter(item => item.token == token);
	if( issue.length > 0) {
		side.empty().append(issueDetail.body(issue[0]));
		$(".fixed-action-btn .btn-issue").remove();
		$(".fixed-action-btn").children().hide();
		$(".fixed-action-btn").append(issueDetail.buttons(issue[0]))
		M.Materialbox.init(side.find(".materialboxed"));
		window.history.replaceState({}, '', issue[0].permLink)
		side.addClass("open")
		side.scrollTop(0)
		issuesmap.followResize()
	} else {
		console.warn("This token does not exist: ", token);
	}
}

export async function closeIssue() {
	var side=$("#issue-detail")
	side.removeClass("open")
	issuesmap.followResize()
	$(".fixed-action-btn .btn-issue").remove();
	$(".fixed-action-btn").children().show();
	M.Materialbox.getInstance(side.find(".materialboxed")).close();
}

window.viewIssue = viewIssue
window.closeIssue = closeIssue
