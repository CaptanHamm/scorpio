module.exports = async ( client, message ) => {
	
	try {
		
		/** Split message on spaces and remove the command part */
		let args = message.content.split(/\s+/g).slice(1);
		

		// DO SOMETHING WITH ARGUMENTS
		// See player.js for example swapi player fetch 
		// See guild.js for example swapi guild fetch 

		
		/** Prepare response to user */
		let today = new Date();
		let embed = {
			title:'My embed title',
			description:'My main embed description text',
			fields:[]
		}
		
		let field = {
			name:'My field name',
			value:'My field description text'
		}
		
		embed.fields.push( field );
		
		embed.color = 0x936EBB;
		embed.timestamp = today;

		message.channel.send({embed});
		
	} catch(e) {
		throw e;
	}

}