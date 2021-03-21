async function upvoteClickHandler(event) {
    event.preventDefault();
    // event.currentTarget.classList.toggle('liked');
    const post_id = window.location.toString().split('/')[
      window.location.toString().split('/').length - 1
    ];
    if (event.target.classList.value === 'like-button') {
      const response = await fetch('/api/votes', {
        method: 'POST',
        body: JSON.stringify({
          post_id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }

    } else {
      // const vote_id = document.querySelector('button[class="liked-button"]').class;
      const vote_id_obj = document.querySelector('.liked-button');
      let vote_id = vote_id_obj.id.replace('vote-id-','');  
      const response = await fetch(`/api/votes/${vote_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (response.ok) {
        document.location.reload();
      } else {
        alert(response.statusText);
      }
    }
  }

  
  // document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);
  document.querySelector('.buttons').addEventListener('click', upvoteClickHandler);
  //document.querySelector('.liked-button').addEventListener('click', upvoteClickHandler);
  
  // document.querySelector('.like-button').addEventListener('click', (e) => {
  //   upvoteClickHandler;
  // });