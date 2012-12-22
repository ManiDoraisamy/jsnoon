function ObjectGraph(data)
{
	this.data = data;
	this.objects = new Array();

	this.get = function(id)
	{
		if(this.objects[id])
			return this.objects[id];
		else if(this.data[id])
		{
			var obj = new JsObject(id, this.data[id], this);
			this.objects[id] = obj;
			return obj;
		}
		else
			throw id+" not in data";
	};

	this.getRoot = function()
	{
		return this.get(this.data.root);
	};
}

function JsObject(id, content, graph)
{
	this.id = id;
	this.content = content;
	this.graph = graph

	this.getId = function()
	{
		return this.id;
	};

	this.getContent = function()
	{
		return this.content;
	};

	this.get = function(name)
	{
		return this.content[name];
	};

	this.getValue = function(name)
	{
		var value = this.content[name];
		if(value)
			if(value instanceof Array)
				return value;
			else if(value instanceof Object)
				return value;
			else
				throw name+" not a list in "+this.id;
		else
		{
			throw name+" not found in "+this.id;
		}
	};

	this.getObject = function(name)
	{
		for (var i in this.get(name))
			return this.graph.get(i);
		return null;
	};

	this.getList = function(name)
	{
		var list = new Array();
		for (var i in this.get(name))
			list[i] = this.graph.get(i);
		return list;
	};
}