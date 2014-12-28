/*
Copyright (c) 2003-2009, CKSource - Frederico Knabben. All rights reserved.
For licensing, see LICENSE.html or http://ckeditor.com/license
*/

/**
 * @file Plugin for inserting teasers.
 */
CKEDITOR.plugins.add( 'teaser',
{
  requires  : [ 'fakeobjects' ],
  lang: ['ru', 'en'],

  init : function( editor ) {
    // Add the styles that renders our fake objects.
    CKEDITOR.addCss(
      'img.teaser' +
      '{' +
      'background: #dedede center 40% no-repeat url(' + CKEDITOR.getUrl( this.path + 'images/teaser.png' ) + ');' +
      'clear: both;' +
      'display: block;' +
      'float: none;' +
      'width: 100%;' +
			'margin-bottom: 15px' +
      'border-top: #666 1px dotted;' +
      'border-bottom: #666 1px dotted;' +
      'height: 6px;' +
      '}'
      );

    // Register the toolbar buttons.

    editor.ui.addButton( 'Teaser',
    {
      label : editor.lang.teaser.button,
      icon : this.path + 'images/teaser.png',
      command : 'teaser',
      toolbar: "insert"
    });

    editor.addCommand( 'teaser',
    {
      exec : function() {

        var images = editor.document.getElementsByTag( 'img' );
        for ( var i = 0, len = images.count() ; i < len ; i++ )
        {
          var img = images.getItem( i );
          if ( img.hasClass( 'teaser' ) ) {
            if (confirm(editor.lang.teaser.alert))
            {
              img.remove();
              break;
            }
            else return;
          }
        }

        insertComment( 'teaser' );
      }
    });

    // This function effectively inserts the comment into the editor.
    function insertComment( text ) {
      // Create the fake element that will be inserted into the document.
      // The trick is declaring it as an <hr>, so it will behave like a
      // block element (and in effect it behaves much like an <hr>).
      if ( !CKEDITOR.dom.comment.prototype.getAttribute ) {
        CKEDITOR.dom.comment.prototype.getAttribute = function() {
          return '';
        };
        CKEDITOR.dom.comment.prototype.attributes = {
          align : ''
        };
      }
      var fakeElement = editor.createFakeElement( new CKEDITOR.dom.comment( text ), text, 'hr' );

      fakeElement.setAttributes({
        alt: editor.lang.teaser.fakeTitle,
        title: editor.lang.teaser.fakeTitle
      });

      // This is the trick part. We can't use editor.insertElement()
      // because we need to put the comment directly at <body> level.
      // We need to do range manipulation for that.

      // Get a DOM range from the current selection.
      var range = editor.getSelection().getRanges()[0],
      elementsPath = new CKEDITOR.dom.elementPath( range.getCommonAncestor( true ) ),
      element = ( elementsPath.block && elementsPath.block.getParent() ) || elementsPath.blockLimit,
      hasMoved;

      // If we're not in <body> go moving the position to after the
      // elements until reaching it. This may happen when inside tables,
      // lists, blockquotes, etc.
      while (element && element.getName() != 'body') {
        range.moveToPosition( element, CKEDITOR.POSITION_AFTER_END );
        hasMoved = 1;
        element = element.getParent();
      }

      // Split the current block.
      if ( !hasMoved )
      range.splitBlock( 'p' );

      // Insert the fake element into the document.
      range.insertNode( fakeElement );

      // Now, we move the selection to the best possible place following
      // our fake element.
      var next = fakeElement;
      while ( ( next = next.getNext() ) && !range.moveToElementEditStart( next ) )
      {console.log(next)}
			range.select();
    }
  },

  afterInit : function( editor )
  {
    // Adds the comment processing rules to the data filter, so comments
    // are replaced by fake elements.
    editor.dataProcessor.dataFilter.addRules(
    {
      comment : function( value )
      {
        if ( !CKEDITOR.htmlParser.comment.prototype.getAttribute ) {
          CKEDITOR.htmlParser.comment.prototype.getAttribute = function() {
            return '';
          };
          CKEDITOR.htmlParser.comment.prototype.attributes = {
            align : ''
          };
        }

        if ( value == 'teaser') return editor.createFakeParserElement( new CKEDITOR.htmlParser.comment( value ), value, 'hr' );
        return value;
      }
    });
  }
});