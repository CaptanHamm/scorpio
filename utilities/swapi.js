module.exports = (clientSwgoh, clientCache, clientHelpers) => {
	
	swgoh = clientSwgoh;
	cache = clientCache;
	helpers = clientHelpers;
	
	playerCooldown = 2;
	guildCooldown = 6;
	
	return {
		player:player,
		guild:guild
	};

};

async function player( allycode, language ) {
	
	try {
    	
		if( !allycode || isNaN(allycode) ) { throw new Error('Please provide a valid allycode'); }
		allycode = parseInt(allycode);
		
        let expiredDate = new Date();
	        expiredDate.setHours(expiredDate.getHours() - playerCooldown);
		
		/** Get player from cache */
		let player = await cache.get('swapi', 'players', {allyCode:allycode, updated:{ $gte:expiredDate.getTime() }});

		/** Check if existance and expiration */
		if( !player || !player[0] ) { 
			/** If not found or expired, fetch new from API and save to cache */
			player = await swgoh.fetchPlayer({ allycodes:allycode, language:(language || "eng_us") });
			player = await cache.put('swapi', 'players', {allyCode:player[0].allyCode}, player[0]);
		} 

        player = Array.isArray(player) ? player[0] : player;
		return player;
		
	} catch(e) { 
		throw e; 
	}    		

}

async function guild( allycode, language ) {
	
	try {
    	
		if( !allycode || isNaN(allycode) ) { throw new Error('Please provide a valid allycode'); }
		allycode = parseInt(allycode);
				
		/** Get player from cache */
		let player = await cache.get('swapi', 'players', {allyCode:allycode});
		if( !player || !player[0] ) { throw new Error('I don\'t know this player, try syncing them first'); }
		
        let expiredDate = new Date();
	        expiredDate.setHours(expiredDate.getHours() - guildCooldown);

		let guild  = await cache.get('swapi', 'guilds', {name:player[0].guildName, updated:{ $gte:expiredDate.getTime() }});

		/** Check if existance and expiration */
		if( !guild || !guild[0] ) { 
			/** If not found or expired, fetch new from API and save to cache */
			guild = await swgoh.fetchGuild({ allycode:allycode, language:(language || "eng_us") });
			guild = await cache.put('swapi', 'guilds', {name:guild.name}, guild);
			
		} else {
			/** If found and valid, serve from cache */
			guild = guild[0];
		}
		
		let roster = guild.roster.map(x => x.allyCode);
		roster.forEach( async p => {
			try {
				await this.player( p );
			} catch(e) {
				console.log(e.message);
			}
		});
		
		return guild;
		
	} catch(e) { 
		throw e; 
	}    		

}
