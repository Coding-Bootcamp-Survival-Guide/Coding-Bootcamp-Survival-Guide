async function deleteFormHandler(event) {
    event.preventDefault();
    const id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];

    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE'
    });
    console.log("I am in here and id is ", id);
    
    if (response.ok) {
      document.location.replace('/dashboard/')
    } else {
      alert(response.statusText);
    }
  
}
  
  document.querySelector('.delete-post-btn').addEventListener('click', deleteFormHandler);