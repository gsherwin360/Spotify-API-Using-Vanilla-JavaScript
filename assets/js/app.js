/**----------------------------------------------------------------
 * Author        : Sherwin D. Gonzales
 * Date Created  : 02/10/2021
 * Last Modified :
 * Modifications : 
 * Descriptions  : 
 *
 *  Variables / Function Hoisting
 *   - Hoisting is a JavaScript mechanism where variables 
 *     and function declarations are moved to the top 
 *     of their scope before code execution.
 *   - To avoid Hoisting ensures that we always declare 
 *     our variables / functions first.
-----------------------------------------------------------------*/
'use strict';

const appCallback = function(){
	const APIController = (function(){
		const clientID = 'ac741282cd3b4d96b07d262c0964cd9a';
		const clientSecret = 'ead037499592480793b128b26c7ee675';

		// All requests to Web API require authentication.
		// This is achieved by sending a valid OAuth access token in the request header.

		// Private Methods
		const _getToken = async () => {
			let result = '';

			const encyrpt = window.btoa(clientID + ':' + clientSecret);

	        const response = await fetch('https://accounts.spotify.com/api/token', {
	            method: 'POST',
	            headers: {
	                'Content-Type' : 'application/x-www-form-urlencoded', 
	                'Authorization' : 'Basic ' + encyrpt
	            },
	            body: 'grant_type=client_credentials'
	        });

	        if(response.status == 200){
	        	const data = await response.json();
	        	result = data.access_token;
	        }

	        return result;
	    }; // End of async function


		const _getGenres = async (token) => {
			const result = await fetch('https://api.spotify.com/v1/browse/categories?locale=sv_US', {
				method: 'GET',
				headers: { 'Authorization': 'Bearer ' + token }
			});
		
			const data = await result.json();
			return data.categories.items;
		}; // End of async function


		const _getPlaylistByGenre = async (token, genreID) => {
			const limit = 10;

			const result = await fetch('https://api.spotify.com/v1/browse/categories/'+ genreID +'/playlists?limit=' + limit, {
				method: 'GET',
				headers: { 'Authorization': 'Bearer ' + token }
			});

			const data = await result.json();
			return data.playlists.items;
		}; // End of async function

		const _getTracks = async (token, tracksEndPoint) => {
	        const limit = 10;

	        const result = await fetch(tracksEndPoint + '?limit=' + limit, {
	            method: 'GET',
	            headers: { 'Authorization' : 'Bearer ' + token}
	        });

	        const data = await result.json();
	        return data.items;
	    };

	    const _getTrack = async (token, trackEndPoint) => {
	        const result = await fetch(trackEndPoint, {
	            method: 'GET',
	            headers: { 'Authorization' : 'Bearer ' + token}
	        });

	        const data = await result.json();
	        return data;
	    };

	    // Determines whether the passed value is empty or not
		// Returns true if the value is empty; otherwise, false
		const _isFieldNotEmpty = function(value){
			return typeof value !== "undefined" && value !== null && value !== "";
		};

		// Determines whether the passed value is an Array
		// Returns true if the value is an Array; otherwise, false.
		const _isArray = function(value){
			// ES5 actually has a method for this (ie9+)
			// Array.isArray(value);
			return _isFieldNotEmpty(value) && typeof value === 'object' && value.constructor === Array;
		};

	    return {
	        getToken() {
	            return _getToken();
	        },
	        getGenres(token) {
	            return _getGenres(token);
	        },
	        getPlaylistByGenre(token, genreId) {
	            return _getPlaylistByGenre(token, genreId);
	        },
	        getTracks(token, tracksEndPoint) {
	            return _getTracks(token, tracksEndPoint);
	        },
	        getTrack(token, trackEndPoint) {
	            return _getTrack(token, trackEndPoint);
	        },
	        isFieldNotEmpty(value) {
	            return _isFieldNotEmpty(value);
	        },
	        isArray(value) {
	            return _isArray(value);
	        }
	    }
	})();

	// UI Module
	const UIController = (function(){
		 //object to hold references to html selectors
	    const DOMElements = {
	        selectGenre: document.getElementById('select_genre'),
            selectPlaylist: document.getElementById('select_playlist'),
            songDetail: document.getElementById('song-detail'),
            songList: document.getElementById('song-list'),
            buttonSubmit: document.getElementById('btn_submit'),
            inputHiddenToken: document.getElementById('hidden_token')
	    };

	    // Public methods
	    return {
	    	DOMElements,
	        // need methods to create select list option
	        createGenre(text, value) {
	            const html = '<option value="'+ value +'">'+ text +'</option>';
	            DOMElements.selectGenre.insertAdjacentHTML('beforeend', html);
	            return false;
	        }, 

	        createPlaylist(text, value) {
	            const html = '<option value="'+ value +'">'+ text +'</option>';
	            DOMElements.selectPlaylist.insertAdjacentHTML('beforeend', html);
	            return false;
	        },

	        // need method to create a track list group item 
	        createTrack(id, name) {
	            const html = '<a href="javascript:;" class="list-group-item list-group-item-action list-group-item-light" id="'+ id +'">'+ name +'</a>';
	            DOMElements.songList.insertAdjacentHTML('beforeend', html);
	            return false;
	        },

	        // need method to create the song detail
	        createTrackDetail(img, title, artist) {
	            const detailDiv = DOMElements.songDetail;

	            // any time user clicks a new song, we need to clear out the song detail div
	            detailDiv.innerHTML = '';

	            let html = '<div class="row col-sm-12 px-0">';
	            	html += '<img src="'+ img +'" alt="">'
	            html += '</div>';
	            html += '<div class="row col-sm-12 px-0">';
	            	html += '<label for="Genre" class="form-label col-sm-12">'+ title +':</label>';
	            html += '</div>';
	            html += '<div class="row col-sm-12 px-0">';
	            	html += '<label for="artist" class="form-label col-sm-12">By '+ artist +':</label>';
	            html += '</div>';  

	            detailDiv.insertAdjacentHTML('beforeend', html);
	            return false;
	        },

	        resetTrackDetail() {
	            DOMElements.songDetail.innerHTML = '';
	            return false;
	        },

	        resetTracks() {
	            DOMElements.songList.innerHTML = '';
	            this.resetTrackDetail();
	            return false;
	        },

	        resetPlaylist() {
	            DOMElements.selectPlaylist.innerHTML = '';
	            this.resetTracks();
	            return false;
	        },
	        
	        storeToken(value) {
	            DOMElements.inputHiddenToken.value = value;
	            return false;
	        },

	        getStoredToken() {
	            return {
	                token: DOMElements.inputHiddenToken.value
	            }
	        }
	    }
	})();


	const APPController = (function(UICtrl, APICtrl) {
	    // get input field object ref
	    const DOMElements = UICtrl.DOMElements;

	    // Get genres on page load
	    const loadGenres = async () => {
	        // Get the token
	        const token = await APICtrl.getToken();

	        if( APICtrl.isFieldNotEmpty(token) ){
	        	// Store the token onto the page
		        UICtrl.storeToken(token);

		        // Get the genres
		        const genres = await APICtrl.getGenres(token);

		        // Populate our genres select element
		        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
	        } else {
	        	const msg = "Invalid Token. Please refresh this page and try again.";
	        	const disabledComponents = new Promise(function(resolve, reject){
					DOMElements.buttonSubmit.disabled = true;
					DOMElements.buttonSubmit.innerHTML = msg;
					resolve();
				});

	        	disabledComponents.then(function(list){
					window.alert(msg);
				});
	        }
	    };

	    // create genre change event listener
	    DOMElements.selectGenre.addEventListener('change', async () => {
	        //reset the playlist
	        UICtrl.resetPlaylist();
	        //get the token that's stored on the page
	        const token = UICtrl.getStoredToken().token;        
	        // get the genre select field
	        const genreSelect = DOMElements.selectGenre;       
	        // get the genre id associated with the selected genre
	        const genreId = genreSelect.options[genreSelect.selectedIndex].value;             
	        // ge the playlist based on a genre
	        const playlist = await APICtrl.getPlaylistByGenre(token, genreId);       
	        // create a playlist list item for every playlist returned
	        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));

	        return false;
	    });
	     

	    // create submit button click event listener
	    DOMElements.buttonSubmit.addEventListener('click', async (e) => {
	        // prevent page reset
	        e.preventDefault();
	        // clear tracks
	        UICtrl.resetTracks();
	        //get the token
	        const token = UICtrl.getStoredToken().token;        
	        // get the playlist field
	        const playlistSelect = DOMElements.selectPlaylist;
	        // get track endpoint based on the selected playlist
	        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
	        // get the list of tracks
	        const tracks = await APICtrl.getTracks(token, tracksEndPoint);
	        // create a track list item
	        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
	        
	        return false;
	    });

	    // create song selection click event listener
	    DOMElements.songList.addEventListener('click', async (e) => {
	        // prevent page reset
	        e.preventDefault();
	        UICtrl.resetTrackDetail();
	        // get the token
	        const token = UICtrl.getStoredToken().token;
	        // get the track endpoint
	        const trackEndpoint = e.target.id;
	        //get the track object
	        const track = await APICtrl.getTrack(token, trackEndpoint);
	        // load the track details
	        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);

	        return false;
	    });    

	    return {
	        init() {
	            loadGenres();
	        }
	    }
	})(UIController, APIController);

	// will need to call a method to load the genres on page load
	APPController.init();
};


// Document Ready in Vanilla JS
if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.doScroll)) {
	appCallback();
} else {
	document.addEventListener('DOMContentLoaded', appCallback);
}