function toggleEditForm(postId) {
    const editForm = document.getElementById(`editForm-${postId}`);
    const post = document.getElementById(`post-${postId}`);
    if (editForm.style.display === 'none') {
        editForm.style.display = 'block';
        post.style.display = 'none';
    } else {
        editForm.style.display = 'none';
        post.style.display = 'block';
    }
}