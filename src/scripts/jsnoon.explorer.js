function JSnoonExplorer(id, headerId, source)
{
	this.graph = null;

	this.id = id;
	this.pane = jQuery("#"+this.id);
	this.x = this.pane.width()/2;
	this.y = this.pane.height()/2;

	this.header = jQuery("#"+headerId);

	this.source = source;

	this.pattern = null;

	this.loadURL = function(url)
	{
		this.pane.html("Loading...");
		jQuery.getJSON(url,
			function(data, textStatus)
			{
				if(textStatus)
				{
					explorer.load(data);
				}
				else
					alert(textStatus)
			});
	}

	this.load = function(data)
	{
		this.graph = new ObjectGraph(data);
		this.pattern = null;
		this.pane.html("Rendering...");
		this.render();
	}

	this.select = function(id)
	{
		this.graph.data.root = id;
		this.pattern = null;
		this.render();
	}

	this.search = function(pattern)
	{
		this.pattern = (pattern == "" ? null : pattern);
		this.render();
	}

	this.render = function()
	{
		var html = "";
		var root = this.graph.getRoot();
		var width = 190;
		var height = 150;
		html += "<div class='center' style='position:absolute; margin-left:" + (this.x-width/2)
				+ "px; margin-top:" + (this.y-height/2) + "px; width:" + width
				+"px; height:" + height + "px;'>";
		html += "<div>" + root.getId() + "</div><br>";

		html += "<table border='0' cellpadding='0' cellspacing='0' align='center'>";
		var content = root.getContent();
		var children = new Array();
		var childNames = new Array();
		var count = 0;
		for(var name in content)
		{
			var value = content[name];
			if(value instanceof Object)
			{
				for(var cname in value)
				{
					var cvalue = value[cname];
					children[count] = this.graph.get(cname);
					childNames[count] = cvalue;
					count++;
				}
			}
			else
			{
				html += "<tr>";
				html += "<td><input type='text' class='value' value='" + name + "'></td><td> : </td>";
				html += "<td><input type='text' class='value' value='" + (value?value:"") + "'></td>";
				html += "</tr>";
			}
		}
		html += "</table>";
		html += "</div>";
		var angle = 360/children.length;
		var radian = angle*Math.PI/180;
		var cwidth = 100;
		var cheight = 20;
		var radius = 250;
		var accrad = 0;
		for(var i = 0; i < children.length; i++)
		{
			var chtml = "";
			var match = false;
			var child = children[i];
			var xval = Math.round(this.x - cwidth/2 + Math.sin(accrad)*radius);
			var yval = Math.round(this.y - cheight/2 + Math.cos(accrad)*radius);
			chtml += "<div class='child' style='position:absolute; margin-left:" + xval
			+ "px; margin-top:" + yval + "px; width:" + cwidth + "px; height:" + cheight + "px;'>";
			chtml += "<a href='javascript:explorer.select(\""+child.getId()
					+"\");' onmouseover='$(\"#child-preview\").html($(\"#"+child.getId()
					+"\").html())' onmouseout='$(\"#child-preview\")'>"
					+ childNames[i] + "<a>";
			chtml += "</div>";

			var xc = Math.round(this.x - cwidth/2 + Math.sin(accrad)*radius*1.25);
			var yc = Math.round(this.y - cheight/2 + Math.cos(accrad)*radius*1.25);
			chtml += "<div id='" + child.getId()
				+ "' class='child-details' style='position:absolute; margin-left:" + xc
				+ "px; margin-top:" + yc + "px; width:" + cwidth + "px; height:" + cheight + "px;'>";
			chtml += "<table border='0' cellpadding='0' cellspacing='0'>";
			chtml += "<tr><td colspan='3' align='center'>" + childNames[i] + "<hr/></td></tr>";
			var ccontent = child.getContent();
			for(var cname in ccontent)
			{
				var cvalue = ccontent[cname];
				if(!(cvalue instanceof Object))
				{
					chtml += "<tr>";
					chtml += "<td><input type='text' class='value' value='" + cname + "'></td><td> : </td>";
					chtml += "<td><input type='text' class='value' value='" + (cvalue?cvalue:"") + "'></td>";
					chtml += "</tr>";
					if(this.pattern == null)
						match = true;
					else if(cvalue && cvalue.toString && cvalue.toString().toUpperCase().indexOf(this.pattern.toUpperCase()) >= 0)
						match = true;
				}
			}
			chtml += "</table>"
			chtml += "</div>";

			if(match)
				html += chtml;
			accrad += radian;
		}

		this.pane.html(html);

		var head = "";
		head += "<table border='0' width='100%'><tr>";
		head += "<td><b>"+root.getId()+"<b></td>";
		head += "<td align='right'><form onSubmit='return false'><input type='text' class='load' name='pattern' value='"
				+ (this.pattern?this.pattern:"") + "' style='width:150px;'>";
		head += " <input type='button' class='load' value='Search' onclick='explorer.search(this.form.pattern.value)'></form></td>";
		head += "</tr></table>";
		this.header.html(head);

		$(".child-details").hide();
	}
}