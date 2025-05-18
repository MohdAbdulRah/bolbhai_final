document.addEventListener("DOMContentLoaded", () => {
    // Handle adding new comments
    document.querySelectorAll("form[action^='/comment/']").forEach(form => {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const textarea = this.querySelector("textarea[name='content']");
        const content = textarea.value.trim();
        if (!content) return;
  
        const issueId = this.action.split("/comment/")[1];
        const response = await fetch(`/comment/${issueId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content })
        });
  
        if (response.ok) {
          const data = await response.json();
  
          const sidebar = this.closest(".comment-sidebar");
          const commentList = sidebar.querySelector(".comment-list");
  
          // Remove "No comments yet" message if present
          const noCommentsMsg = commentList.querySelector(".no-comments-msg");
          if (noCommentsMsg) noCommentsMsg.remove();
  
          // Add new comment (no form, just button for delete)
          const div = document.createElement("div");
          div.className = "comment mb-2 p-2";
          div.style.borderBottom = "1px solid #eee";
          div.innerHTML = `
            <strong>${data.username}</strong>
            <button
              type="button"
              class="delete-comment btn btn-danger btn-sm"
              data-issueid="${issueId}"
              data-commentid="${data.commentId}"
              onclick="return confirm('Are you sure?')"
            >
              Delete
            </button>
            <br/>
            <small>${data.content}</small>
          `;
          commentList.prepend(div);
  
          // Clear textarea
          textarea.value = "";
  
          // Update comment count
          const commentBtn = document.querySelector(`.comment-btn[data-id='${issueId}']`);
          const countSpan = commentBtn.querySelector(".comment-count");
          if (countSpan) {
            countSpan.textContent = data.commentCount;
          }
        }
      });
    });
  
    // Handle comment deletion dynamically
    document.addEventListener("click", async function (e) {
      if (e.target.classList.contains("delete-comment")) {
        e.preventDefault();
        const issueId = e.target.dataset.issueid;
        const commentId = e.target.dataset.commentid;
  
        if (!confirm("Are you sure?")) return;
  
        const response = await fetch(`/comment/${issueId}/${commentId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" }
        });
  
        if (response.ok) {
          const commentDiv = e.target.closest(".comment");
          commentDiv.remove();
  
          // Update comment count
          const commentBtn = document.querySelector(`.comment-btn[data-id='${issueId}']`);
          const countSpan = commentBtn.querySelector(".comment-count");
          if (countSpan) {
            const newCount = Math.max(0, parseInt(countSpan.textContent) - 1);
            countSpan.textContent = newCount;
          }
  
          // If no comments left, show "No comments yet"
          const sidebar = commentDiv.closest(".comment-sidebar");
          const commentList = sidebar.querySelector(".comment-list");
          const remainingComments = commentList.querySelectorAll(".comment");
          if (remainingComments.length === 0) {
            commentList.innerHTML = '<div class="text-muted no-comments-msg">No comments yet.</div>';
          }
        } else {
          alert("Failed to delete comment.");
        }
      }
    });
  });
  