'use strict';

$ (function () {
	var Aaca = `aacaacabcabaaac`;
	var Dova = `Dovahkiin, Dovahkiin, naal ok zin los vahriin,
Wah dein vokul mahfaeraak ahst vaal!
Ahrk fin norok paal graan fod nust hon zindro zaan,
Dovahkiin, fah hin kogaan mu draal!

Huzrah nu, kul do od, wah aan bok lingrah vod,
Ahrk fin tey, boziik fun, do fin gein!
Wo lost fron wah ney dov, ahrk fin reyliik do jul,
Voth aan suleyk wah ronit faal krein

Ahrk fin zul, rok drey kod, nau tol morokei frod,
Rul lot Taazokaan motaad voth kein!
Sahrot Thu'um, med aan tuz, vey zeim hokoron pah,
Ol fin Dovahkiin komeyt ok rein!

Dovahkiin, Dovahkiin, naal ok zin los vahriin,
Wah dein vokul mahfaeraak ahst vaal!
Ahrk fin norok paal graan fod nust hon zindro zaan,
Dovahkiin, fah hin kogaan mu draal!

Ahrk fin Kel lost prodah, do ved viing ko fin krah,
Tol fod zeymah win kein meyz fundein!
Alduin, feyn do jun, kruziik vokun staadnau,
Voth aan bahlok wah diivon fin lein!

Nuz aan sul, fent alok, fod fin vul dovah nok,
Fen kos nahlot mahfaeraak ahrk ruz!
Paaz Keizaal fen kos stin nol bein Alduin jot,
Dovahkiin kos fin saviik do muz!

Dovahkiin, Dovahkiin, naal ok zin los vahriin,
Wah dein vokul mahfaeraak ahst vaal!
Ahrk fin norok paal graan fod nust hon zindro zaan
Dovahkiin, fah hin kogaan mu draal!`;
	var Alice = `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, 'and what is the use of a book,' thought Alice 'without pictures or conversations?'`;
	var Powers = "";
	for (var i = 0; i < 31; i++) {
		Powers += (1 << i);
	}
	var Pi = `3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273724587006606315588174881520920962829254091715364367892590360011330530548820466521384146951941511609433057270365759591953092186117381932611793105118548074462379962749567351885752724891227938183011949129833673362440656643086021394946395224737190702179860943702770539217176293176752384674818467669405132000568127145263560827785771342757789609173637178721468440901224953430146549585371050792279689258923542019956112129021960864034418159813629774771309960518707211349999998372978049951059731732816096318595024459455346908302642522308253344685035261931188171010003137838752886587533208381420617177669147303598253490428755468731159562863882353787593751957781857780532171226806613001927876611195909216420198`;
	var Random = "";
	for (var i = 0; i < 1000; i++) {
		var d = Math.floor (Math.pow (2, Math.random () * 3.1)) - 1;
		Random += String.fromCharCode (d + 97);
	}
	var UnicodeHi = ""
		+ "Here are some characters that take two bytes to represent:\n"
		+ "Ⅷ = U+2167, ⨌ = U+2A0C\n"
		+ "\n"
		+ "The following characters take three bytes to represent, and all share a common two-byte prefix. They range from U+28000 to U+2800F:\n"
		+ "𨀀𨀁𨀂𨀃𨀄𨀅𨀆𨀇𨀈𨀉𨀊𨀋𨀌𨀍𨀎𨀏\n\n"
		+ "Try UTF-8 instead of UTF-16 to lower the size of literals. Note that UTF-16 uses a surrogate pair (each end of size 2 bytes) to display a single 3-byte character.";

	$ ("#setAaca").click (function () {
		$ ('#input').val (Aaca);
		refresh ();
	});
	$ ("#setDova").click (function () {
		$ ('#input').val (Dova);
		refresh ();
	});
	$ ("#setAlice").click (function () {
		$ ('#input').val (Alice);
		refresh ();
	});
	$ ("#setPowers").click (function () {
		$ ('#input').val (Powers);
		refresh ();
	});
	$ ("#setPi").click (function () {
		$ ('#input').val (Pi);
		refresh ();
	});
	$ ("#setRandom").click (function () {
		$ ('#input').val (Random);
		refresh ();
	});
	$ ("#setUnicodeHi").click (function () {
		$ ('#input').val (UnicodeHi);
		refresh ();
	});
});

var varLen = false;

$ (function () {
	refresh ();

	function numericInput () {
		var i = parseInt ($ (this).val ());
		if (isNaN (i)) {
			$ (this).val (0);
			return;
		}
		refresh ();
	}

	$ ("#input").on ('input', refresh);

	$ ("#btnLengthFixed").click (function () {
		$ ('.toggler').removeClass ('toggled');
		$ (this).addClass ('toggled');
		varLen = false;
		$ ('#fixedRefLengthOptions').show ();
		refresh ();
	});
	$ ("#btnLengthUnary").click (function () {
		$ ('.toggler').removeClass ('toggled');
		$ (this).addClass ('toggled');
		varLen = true;
		$ ('#fixedRefLengthOptions').hide ();
		refresh ();
	});

	$ ("#offsetBits").change (numericInput);
	$ ("#lengthBits").change (numericInput);
	$ ("#minLength").change (numericInput);

	$ ("#showBits").change (refresh);
	$ ("#encodeUtf8").change (refresh);
});


function prepareLzItem (s) {
	return s
		.replace (" ", "·") // "␠"
		.replace ("\t", "↦") // "␉"
		.replace ("\r", "↩") // "␍"
		.replace ("\n", "↲") // "␊"
		;
}

function toUtf8 (text) {
	var utf8 = unescape (encodeURIComponent (text));
	return utf8;
}

function render (lzss, showBits) {
	/*
	 * Function to highlight referenced letters.
	 */
	var mouseRefNode = function (entering, i) {
		if (entering) {
			$ ("#output .refby-" + i).addClass ('activeRefSource');
		} else {
			$ ("#output .refby-" + i).removeClass ('activeRefSource');
		}
	};

	/*
	 * Create visual elements
	 */
	$ ('#output').empty ();
	for (var i = 0; i < lzss.length; i++) {
		var it = lzss[i];
		var add = "<div class='lzelem'>";

		add += "<div class='" + (it.lit ? "lzlit" : "lzref") + "'>";

		for (var ci = 0; ci < it.len; ci++) {
			add += "<span class='";
			for (var iref = 0; iref < it.referenced.length; iref++) {
				var ref = it.referenced[iref];
				var p0 = ref[0];
				var p1 = ref[1];
				var by = ref[2];
				if (p0 <= ci && ci <= p1) {
					add += "refby-" + by + " ";
				}
			}
			add += "'>";
			add += prepareLzItem (it.text[ci]);
			add += "</span>";
		}

		add += "</div>";


		if (showBits) {
			add += "<div class='lzsubscript lzbits'>"
				+ it.bits
				+ "</div>";
		}

		if (!it.lit) {
			add += "<div class='lzsubscript lzrefval'>"
				+ "[" + it.offset + "," + it.len + "]"
				+ "</div>";
		}

		add += "</div>";

		$ (add)
			.mouseenter (mouseRefNode.bind (this, true, i))
			.mouseleave (mouseRefNode.bind (this, false, i))
			.appendTo ('#output');
	}
}

/*
 * Length of a variable length encoded integer. Encoding is done via prefixing with its length minus 1 in unary.
 * For instance, suppose that we encode a value using 8 bits.
 * Then 5 = 101 becomes 00-101 (2 bits unary prefix, 3 bits content) instead of 00000101 (5 bits to fill up 8 bits, 3 bits of content), so we gain 3 bits.
 * Similarly, 22 = 10110 becomes 0000-10110 instead of 00010110: Now we lose 1 bit.
 *
 * This avoids overhead for small values and allows for arbitrarily large values, avoiding an upper bound.
 * However, it doubles the size of moderately large values.
 */
function unaryCodedLength (i) {
	var n = 0;
	while (i > 0) {
		i = Math.floor (i / 2);
		n++;
	}
	return 2 * n - 1;
}

function refresh () {
	/*
	 * text and encoding
	 */
	var text = $ ('#input').val ();
	var showBits = $ ('#showBits').prop ('checked');
	var encodeUtf8 = $ ('#encodeUtf8').prop ('checked');

	/*
	 * convert text to Utf8
	 */
	var litRawBits;
	if (encodeUtf8) {
		text = toUtf8 (text);
		litRawBits = 8;
	} else {
		litRawBits = 16;
	}

	/*
	 * Literals are always encoded regularly
	 */
	var litBits = litRawBits + 1;

	if (varLen) {
		/*
		 * References are variable-length-encoded and depend on the actual values
		 */
		var refBits = function (offset, len) {
			return 1 + unaryCodedLength (offset) + unaryCodedLength (len);
		};

		var pickBetter = function (option, best) {
			var so = option.textBits - option.bits;
			var sb = best.textBits - best.bits;
			return so > sb ? option : best;
		};

		/*
		 * We're not actually bounded by fixed values, so just set the bounds to very large values.
		 */
		var maxMatchLength = 1 << 30;
		var dictSize = 1 << 30;

	}
	else {
		/*
		 * References use fixed length
		 */
		var dictSizeBits = parseInt ($ ('#offsetBits').val ());
		var matchSizeBits = parseInt ($ ('#lengthBits').val ());
		var refBits = function (offset, len) {
			return 1 + dictSizeBits + matchSizeBits;
		};

		/*
		 * Select minimal match length
		 */
		var computedMinMatchLength = Math.ceil ((refBits + 1) / litBits);
		$ ('#minLength').attr ("min", computedMinMatchLength);

		var minMatchLength = parseInt ($ ('#minLength').val ());
		if (minMatchLength < computedMinMatchLength) {
			minMatchLength = computedMinMatchLength;
			$ ('#minLength').val (computedMinMatchLength);
		}

		var dictSize = 1 << dictSizeBits;
		var maxMatchLength = matchSizeBits == 0
			? 0
			: 1 << matchSizeBits;
		maxMatchLength += minMatchLength;

		var pickBetter = function (option, best) {
			if (option.len < minMatchLength) {
				return best;
			}
			return option.len > best.len ? option : best;
		};

		/*
		 * Display resulting characteristics
		 */
		$ ('#sizeInfo').html (""
			+ "A literal will take "
			+ "1 + " + litRawBits + " = "
			+ litBits + " bits.<br>"
			+ "A reference will take "
			+ "1 + " + dictSizeBits + " + " + matchSizeBits + " = "
			+ (1 + dictSizeBits + matchSizeBits) + " bits, "
			+ "resulting in an offset range from 1 to " + dictSize
			+ " and a length range from " + minMatchLength + " to " + maxMatchLength + ".");
	}

	/*
	 * compress
	 */
	var lzss = [];
	var cursor = 0;
	var index = 0;

	while (cursor < text.length) {
		/*
		 * Our basic option is inserting a literal.
		 */
		var best = {
			lit: true,
			len: 1,
			bits: litBits,
			text: text[cursor],
			textBits: litBits,
			offset: null,

			pos: cursor,
			index: index,
			referenced: [],
		};

		/*
		 * Let's see if there is a reference that's better.
		 */
		for (var offset = 1; offset <= dictSize && cursor - offset >= 0; offset++) {
			var len = 0;
			while (true
			&& (cursor + len < text.length)
			&& (len < maxMatchLength)
			&& (text[cursor - offset + len] == text[cursor + len])
				) {
				len++;
			}

			var match = text.substr (cursor - offset, len);
			var option = {
				lit: false,
				len: len,
				bits: refBits (offset, len),
				text: match,
				textBits: litBits * len,
				offset: offset,

				pos: cursor,
				index: index,
				referenced: [],
			};

			best = pickBetter (option, best);
		}

		/*
		 * We selected a way to insert some text. Append it and advance the cursor appropriately.
		 */
		lzss.push (best);
		index++;
		cursor += best.len;
	}
	text = null;
	cursor = null;

	includeSpanReferences (lzss);

	render (lzss, showBits);
}

function includeSpanReferences (lzss) {
	/*
	 * Function to find element index for position.
	 * Could use a lookup table or binary search, too.
	 */
	function findBlockAtPosition (pos, maxIndex) {
		for (var spanindex = maxIndex; spanindex >= 0; spanindex--) {
			var span = lzss[spanindex];
			if (span.pos <= pos) {
				//console.log ("block " + spanindex + " covers " + span.pos + " to " + (span.pos + span.len - 1));
				return span;
			}
		}
	}

	/*
	 * Let referenced elements link to their sources.
	 */
	for (var i = 0; i < lzss.length; i++) {
		var it = lzss[i];
		if (it.lit) {
			continue;
		}

		var searchBeg = it.pos - it.offset;
		var searchEnd = searchBeg + it.len - 1;
		var end = findBlockAtPosition (searchEnd, it.index);
		var beg = findBlockAtPosition (searchBeg, end.index);

		for (var spanindex = beg.index; spanindex <= end.index; spanindex++) {
			var span = lzss[spanindex];
			var off0 = span == beg ? searchBeg - beg.pos : 0;
			var off1 = span == end ? searchEnd - end.pos : span.len - 1;
			var covered = [off0, off1, i];
			//console.log ("lzss " + i + " references " + spanindex + " with range " + covered);
			span.referenced.push (covered);
		}
	}
}
