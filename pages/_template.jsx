import React from "react";
import { Link } from "react-router";
import { prefixLink } from "gatsby-helpers";

import "expose?$!expose?jQuery!jquery";

import "imports?jQuery=jquery!bootstrap-sass";
import "fastclick";
import "imports?jQuery=jquery&window=>{jQuery}!bootstrap-progressbar/bootstrap-progressbar";
import "imports?jQuery=jquery!gentelella/src/js/helper";

import "../css/app.scss";
import "../css/markdown-styles.css";
import posmLogo from "../images/posm_logo-primary.png";
import posmLogoRetina from "../images/posm_logo-primary@2x.png";

let CURRENT_URL = window.location.href.split('?')[0];
let $BODY = $('body');
let $MENU_TOGGLE = $('#menu_toggle');
let $SIDEBAR_MENU = $('#sidebar-menu');
let $SIDEBAR_FOOTER = $('.sidebar-footer');
let $LEFT_COL = $('.left_col');
let $RIGHT_COL = $('.right_col');
let $NAV_MENU = $('.nav_menu');
let $FOOTER = $('footer');

var setContentHeight = function () {
  // reset height
  $RIGHT_COL.css('min-height', $(window).height());

  var bodyHeight = $BODY.outerHeight(),
      footerHeight = $BODY.hasClass('footer_fixed') ? 0 : $FOOTER.height(),
      leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
      contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

  // normalize content
  contentHeight -= $NAV_MENU.height() + footerHeight;

  $RIGHT_COL.css('min-height', contentHeight);
};

export default class Template extends React.Component {
  static propTypes() {
    return {
      children: React.PropTypes.any,
    };
  }

  componentDidMount() {
    // these are onready functions from gentelella's custom.js
    CURRENT_URL = window.location.href.split('?')[0];
    $BODY = $('body');
    $MENU_TOGGLE = $('#menu_toggle');
    $SIDEBAR_MENU = $('#sidebar-menu');
    $SIDEBAR_FOOTER = $('.sidebar-footer');
    $LEFT_COL = $('.left_col');
    $RIGHT_COL = $('.right_col');
    $NAV_MENU = $('.nav_menu');
    $FOOTER = $('footer');

    $SIDEBAR_MENU.find('a').on('click', function(ev) {
      var $li = $(this).parent();

      if ($li.is('.active')) {
        $li.removeClass('active active-sm');
        $('ul:first', $li).slideUp(function() {
          setContentHeight();
        });
      } else {
        // prevent closing menu if we are on child menu
        if (!$li.parent().is('.child_menu')) {
          $SIDEBAR_MENU.find('li').removeClass('active active-sm');
          $SIDEBAR_MENU.find('li ul').slideUp();
        }

        $li.addClass('active');

        $('ul:first', $li).slideDown(function() {
          setContentHeight();
        });
      }
    });

    // toggle small or large menu
    $MENU_TOGGLE.on('click', function() {
      if ($BODY.hasClass('nav-md')) {
        $SIDEBAR_MENU.find('li.active ul').hide();
        $SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
      } else {
        $SIDEBAR_MENU.find('li.active-sm ul').show();
        $SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
      }

      $BODY.toggleClass('nav-md nav-sm');

      setContentHeight();
    });

    // check active menu
    $SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

    $SIDEBAR_MENU.find('a').filter(function () {
      return this.href == CURRENT_URL;
    }).parent('li').addClass('current-page').parents('ul').slideDown(function() {
      setContentHeight();
    }).parent().addClass('active');

    // recompute content when resizing
    $(window).smartresize(function(){
      setContentHeight();
    });

    setContentHeight();

    // fixed sidebar
    if ($.fn.mCustomScrollbar) {
      $('.menu_fixed').mCustomScrollbar({
        autoHideScrollbar: true,
        theme: 'minimal',
        mouseWheel:{ preventDefault: true }
      });
    }

    $('.collapse-link').on('click', function() {
      var $BOX_PANEL = $(this).closest('.x_panel'),
          $ICON = $(this).find('i'),
          $BOX_CONTENT = $BOX_PANEL.find('.x_content');

      // fix for some div with hardcoded fix class
      if ($BOX_PANEL.attr('style')) {
        $BOX_CONTENT.slideToggle(200, function(){
          $BOX_PANEL.removeAttr('style');
        });
      } else {
        $BOX_CONTENT.slideToggle(200);
        $BOX_PANEL.css('height', 'auto');
      }

      $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
      var $BOX_PANEL = $(this).closest('.x_panel');

      $BOX_PANEL.remove();
    });

    $('[data-toggle="tooltip"]').tooltip({
      container: 'body'
    });

    $(".expand").on("click", function () {
      $(this).next().slideToggle(200);
      $expand = $(this).find(">:first-child");

      if ($expand.text() == "+") {
        $expand.text("-");
      } else {
        $expand.text("+");
      }
    });
  }

  componentDidUpdate() {
    setContentHeight();
  }

  render() {
    return (
      <div className="main_container">
        <div className="col-md-3 left_col">
          <div className="left_col scroll-view">
            <div className="navbar nav_title" style={{ border: 0 }}>
              <Link to={prefixLink("/")} className="site_title">
                <img src={prefixLink(posmLogo)} srcSet={`${prefixLink(posmLogoRetina)} 2x`} />
              </Link>
            </div>

            <div className="clearfix" />

            {/* sidebar menu */}
            <div id="sidebar-menu" className="main_menu_side hidden-print main_menu">
              <div className="menu_section">
                <h3>General</h3>
                <ul className="nav side-menu">
                  <li><Link to={prefixLink("/")}><i className="fa fa-home" /> Home</Link></li>
                </ul>
              </div>
              <div className="menu_section">
                <h3>Tasks</h3>
                <ul className="nav side-menu">
                  <li><Link to={prefixLink("/opendronemap/")}><i className="fa fa-cubes" /> OpenDroneMap</Link>
                  </li>
                  <li><a><i className="fa fa-cubes" /> GeoTIFF → tiles <span className="fa fa-chevron-down" /></a>
                    <ul className="nav child_menu">
                      <li><a href="general_elements.html">Instructions</a></li>
                      <li><a href="form_advanced.html">Start</a></li>
                    </ul>
                  </li>
                </ul>
              </div>

            </div>
            {/* /sidebar menu */}
          </div>
        </div>

        {/* top navigation */}
        <div className="top_nav">
          <div className="nav_menu">
            <nav className="" role="navigation">
              <div className="nav toggle">
                <a id="menu_toggle"><i className="fa fa-bars" /></a>
              </div>
            </nav>
          </div>
        </div>
        {/* /top navigation */}

        {/* page content */}
        <div className="right_col" role="main">
          {this.props.children}
        </div>
        {/* /page content */}
      </div>
    );
  }
}
