<?php
/**
 * Plugin Name: Team Members Block
 * Description: Custom Gutenberg blocks to display team members with photo, name, job title, bio, and social media links.
 * Version: 1.0.0
 * Author: Shrusti Ramani
 */

if (!defined('ABSPATH')) exit;

// Register block scripts
function tmb_register_blocks() {
    // Register build files
    wp_register_script(
        'tmb-blocks',
        plugins_url('build/index.js', __FILE__),
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'),
        filemtime(plugin_dir_path(__FILE__) . 'build/index.js')
    );

    // Register CSS 
    wp_register_style(
        'tmb-blocks-style',
        plugins_url('build/style.css', __FILE__),
        array(),
        filemtime(plugin_dir_path(__FILE__) . 'build/style.css')
    );

    register_block_type('tmb/team-member', array(
        'editor_script' => 'tmb-blocks',
        'editor_style'  => 'tmb-blocks-style',
        'style'         => 'tmb-blocks-style',
    ));

    register_block_type('tmb/team-members', array(
        'editor_script' => 'tmb-blocks',
        'editor_style'  => 'tmb-blocks-style',
        'style'         => 'tmb-blocks-style',
    ));
}
add_action('init', 'tmb_register_blocks');
