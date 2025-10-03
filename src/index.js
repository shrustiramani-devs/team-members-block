import { registerBlockType } from '@wordpress/blocks';
import { 
    RichText, 
    MediaUpload, 
    MediaUploadCheck,
    BlockControls,
    AlignmentToolbar,
    InspectorControls,
    InnerBlocks,
    useBlockProps
} from '@wordpress/block-editor';
import { 
    Button, 
    PanelBody, 
    TextControl, 
    SelectControl,
    ToggleControl,
    RangeControl,
    BaseControl
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

// Social media presets 
const SOCIAL_PRESETS = [
    { label: 'Twitter', value: 'fab fa-twitter', pattern: 'twitter.com|x.com' },
    { label: 'Facebook', value: 'fab fa-facebook-f', pattern: 'facebook.com' },
    { label: 'LinkedIn', value: 'fab fa-linkedin-in', pattern: 'linkedin.com' },
    { label: 'Instagram', value: 'fab fa-instagram', pattern: 'instagram.com' },
    { label: 'YouTube', value: 'fab fa-youtube', pattern: 'youtube.com' },
    { label: 'GitHub', value: 'fab fa-github', pattern: 'github.com' },
    { label: 'Website', value: 'fas fa-globe', pattern: '' },
    { label: 'Email', value: 'fas fa-envelope', pattern: 'mailto:' },
];

// =============== Team Member Profile Block ===============
registerBlockType('tmb/team-member', {
    title: 'Team Member Profile',
    icon: 'id-alt',
    category: 'widgets',
    parent: ['tmb/team-members'],
    attributes: {
        name: { 
            type: 'string', 
            source: 'html', 
            selector: 'h3.tmb-member-name',
            default: 'Team Member Name'
        },
        title: { 
            type: 'string', 
            source: 'text', 
            selector: '.tmb-member-title',
            default: 'Job Title'
        },
        imageUrl: { type: 'string', default: '' },
        imageId: { type: 'number', default: 0 },
        imageAlt: { type: 'string', default: '' },
        bio: { type: 'string', default: '' },
        socialLinks: { type: 'array', default: [] },
        textAlignment: { type: 'string', default: 'center' },
        layoutStyle: { type: 'string', default: 'card' },
        showBio: { type: 'boolean', default: false }
    },
    edit: ({ attributes, setAttributes }) => {
        const { 
            name, 
            title, 
            imageUrl, 
            imageId, 
            imageAlt, 
            bio, 
            socialLinks, 
            textAlignment,
            layoutStyle,
            showBio
        } = attributes;

        const blockProps = useBlockProps({
            className: `tmb-member tmb-member-${layoutStyle} text-align-${textAlignment}`
        });

        // Social link handlers
        const addLink = () => {
            const newLinks = [...socialLinks, { 
                url: '', 
                icon: '', 
                label: '',
                service: 'custom'
            }];
            setAttributes({ socialLinks: newLinks });
        };

        const updateLink = (index, field, value) => {
            const newLinks = [...socialLinks];
            newLinks[index][field] = value;
            
            // Auto-detect social media service
            if (field === 'url' && value) {
                const detectedService = SOCIAL_PRESETS.find(preset => 
                    value.includes(preset.pattern) && preset.pattern
                );
                if (detectedService) {
                    newLinks[index].icon = detectedService.value;
                    newLinks[index].service = detectedService.label.toLowerCase();
                }
            }
            
            setAttributes({ socialLinks: newLinks });
        };

        const removeLink = (index) => {
            const newLinks = socialLinks.filter((_, i) => i !== index);
            setAttributes({ socialLinks: newLinks });
        };

        const setSocialPreset = (index, preset) => {
            const newLinks = [...socialLinks];
            newLinks[index].icon = preset.value;
            newLinks[index].service = preset.label.toLowerCase();
            setAttributes({ socialLinks: newLinks });
        };

        const onSelectImage = (media) => {
            setAttributes({ 
                imageUrl: media.url,
                imageId: media.id,
                imageAlt: media.alt || ''
            });
        };

        const onRemoveImage = () => {
            setAttributes({ 
                imageUrl: '',
                imageId: 0,
                imageAlt: ''
            });
        };

        return (
            <Fragment>
                <BlockControls>
                    <AlignmentToolbar
                        value={textAlignment}
                        onChange={(value) => setAttributes({ textAlignment: value || 'center' })}
                    />
                </BlockControls>

                <InspectorControls>
                    <PanelBody title="Member Settings" initialOpen={true}>
                        <SelectControl
                            label="Layout Style"
                            value={layoutStyle}
                            options={[
                                { label: 'Card Style', value: 'card' },
                                { label: 'Minimal Style', value: 'minimal' },
                            ]}
                            onChange={(value) => setAttributes({ layoutStyle: value })}
                        />
                        <ToggleControl
                            label="Show Biography"
                            checked={showBio}
                            onChange={(value) => setAttributes({ showBio: value })}
                        />
                        {showBio && (
                            <BaseControl label="Biography">
                                <textarea
                                    className="components-textarea-control__input"
                                    value={bio}
                                    onChange={(e) => setAttributes({ bio: e.target.value })}
                                    placeholder="Enter member biography..."
                                    rows="4"
                                />
                            </BaseControl>
                        )}
                    </PanelBody>
                    
                    <PanelBody title="Social Links" initialOpen={false}>
                        <p style={{ fontSize: '12px', color: '#757575', marginBottom: '16px' }}>
                            Add social media links. URLs will auto-detect platforms when possible.
                        </p>
                        <Button 
                            onClick={addLink} 
                            isPrimary 
                            style={{ marginBottom: '16px' }}
                        >
                            + Add Social Link
                        </Button>
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <div className="tmb-member-media">
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectImage}
                                allowedTypes={['image']}
                                value={imageId}
                                render={({ open }) => (
                                    <div className="tmb-image-upload">
                                        {!imageUrl ? (
                                            <Button 
                                                onClick={open} 
                                                className="tmb-upload-button"
                                                isPrimary
                                            >
                                                📷 Upload Profile Photo
                                            </Button>
                                        ) : (
                                            <div className="tmb-image-preview">
                                                <img 
                                                    src={imageUrl} 
                                                    alt={imageAlt} 
                                                    className="tmb-member-image"
                                                />
                                                <div className="tmb-image-actions">
                                                    <Button 
                                                        onClick={open} 
                                                        isSmall
                                                    >
                                                        Change
                                                    </Button>
                                                    <Button 
                                                        onClick={onRemoveImage} 
                                                        isSmall
                                                        isDestructive
                                                    >
                                                        Remove
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            />
                        </MediaUploadCheck>
                    </div>

                    <div className="tmb-member-content">
                        <RichText
                            tagName="h3"
                            className="tmb-member-name"
                            value={name}
                            onChange={(value) => setAttributes({ name: value })}
                            placeholder="Enter member name..."
                            allowedFormats={[]}
                        />
                        
                        <RichText
                            tagName="div"
                            className="tmb-member-title"
                            value={title}
                            onChange={(value) => setAttributes({ title: value })}
                            placeholder="Enter job title..."
                            allowedFormats={[]}
                        />

                        {showBio && (
                            <div className="tmb-member-bio">
                                <textarea
                                    className="tmb-bio-textarea"
                                    value={bio}
                                    onChange={(e) => setAttributes({ bio: e.target.value })}
                                    placeholder="Enter biography..."
                                    rows="3"
                                />
                            </div>
                        )}

                        {socialLinks.length > 0 && (
                            <div className="tmb-social-links-editor">
                                <h5>Social Links</h5>
                                {socialLinks.map((link, index) => (
                                    <div key={index} className="tmb-social-link-item">
                                        <div className="tmb-social-link-header">
                                            <SelectControl
                                                label="Social Platform"
                                                value={link.service || 'custom'}
                                                options={[
                                                    { label: 'Custom', value: 'custom' },
                                                    ...SOCIAL_PRESETS.map(preset => ({
                                                        label: preset.label,
                                                        value: preset.label.toLowerCase()
                                                    }))
                                                ]}
                                                onChange={(value) => {
                                                    const preset = SOCIAL_PRESETS.find(p => 
                                                        p.label.toLowerCase() === value
                                                    );
                                                    if (preset) {
                                                        setSocialPreset(index, preset);
                                                    }
                                                }}
                                            />
                                            <Button
                                                isDestructive
                                                isSmall
                                                onClick={() => removeLink(index)}
                                                label="Remove link"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                        
                                        <TextControl
                                            label="Icon Class (e.g., fab fa-twitter)"
                                            value={link.icon}
                                            onChange={(value) => updateLink(index, 'icon', value)}
                                            help="Font Awesome classes work best"
                                        />
                                        
                                        <TextControl
                                            label="Profile URL"
                                            type="url"
                                            value={link.url}
                                            onChange={(value) => updateLink(index, 'url', value)}
                                            placeholder="https://..."
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                        
                        {socialLinks.length === 0 && (
                            <div className="tmb-no-social-links">
                                <Button 
                                    onClick={addLink} 
                                    isSecondary
                                    style={{ marginTop: '10px' }}
                                >
                                    + Add Social Links
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </Fragment>
        );
    },
    save: ({ attributes }) => {
        const { 
            name, 
            title, 
            imageUrl, 
            imageAlt, 
            bio, 
            socialLinks, 
            textAlignment,
            layoutStyle,
            showBio
        } = attributes;

        const blockProps = useBlockProps.save({
            className: `tmb-member tmb-member-${layoutStyle} text-align-${textAlignment}`
        });

        return (
            <div {...blockProps}>
                {imageUrl && (
                    <div className="tmb-member-media">
                        <img 
                            src={imageUrl} 
                            alt={imageAlt || name} 
                            className="tmb-member-image"
                        />
                    </div>
                )}
                
                <div className="tmb-member-content">
                    <RichText.Content 
                        tagName="h3" 
                        className="tmb-member-name" 
                        value={name} 
                    />
                    
                    <RichText.Content 
                        tagName="div" 
                        className="tmb-member-title" 
                        value={title} 
                    />

                    {showBio && bio && (
                        <div className="tmb-member-bio">
                            {bio}
                        </div>
                    )}

                    {socialLinks.length > 0 && (
                        <div className="tmb-social-links">
                            {socialLinks.map((link, index) => (
                                <a 
                                    key={index}
                                    href={link.url}
                                    className={`tmb-social-link tmb-social-${link.service || 'custom'}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    aria-label={`Visit ${name}'s ${link.service || 'social'} profile`}
                                >
                                    <i className={link.icon}></i>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    },
});

// =============== Team Members Wrapper Block ===============
registerBlockType('tmb/team-members', {
    title: 'Team Members Grid',
    icon: 'groups',
    category: 'widgets',
    description: 'A responsive grid container for team member profiles.',
    attributes: {
        columns: { type: 'number', default: 3 },
        gap: { type: 'number', default: 20 },
        layout: { type: 'string', default: 'grid' }
    },
    edit: ({ attributes, setAttributes }) => {
        const { columns, gap, layout } = attributes;
        
        const blockProps = useBlockProps({
            className: `tmb-members tmb-layout-${layout}`,
            style: { 
                gap: `${gap}px`,
                gridTemplateColumns: layout === 'grid' ? `repeat(${columns}, 1fr)` : 'none'
            }
        });

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody title="Grid Settings" initialOpen={true}>
                        <RangeControl
                            label="Columns"
                            value={columns}
                            onChange={(value) => setAttributes({ columns: value })}
                            min={1}
                            max={6}
                        />
                        <RangeControl
                            label="Gap (px)"
                            value={gap}
                            onChange={(value) => setAttributes({ gap: value })}
                            min={0}
                            max={60}
                            step={5}
                        />
                        <SelectControl
                            label="Layout Type"
                            value={layout}
                            options={[
                                { label: 'Grid', value: 'grid' },
                                { label: 'Flexbox', value: 'flex' },
                            ]}
                            onChange={(value) => setAttributes({ layout: value })}
                        />
                    </PanelBody>
                </InspectorControls>

                <div {...blockProps}>
                    <InnerBlocks 
                        allowedBlocks={['tmb/team-member']} 
                        orientation="horizontal"
                        template={[
                            ['tmb/team-member'],
                            ['tmb/team-member'],
                            ['tmb/team-member']
                        ]}
                        templateLock={false}
                    />
                </div>
            </Fragment>
        );
    },
    save: ({ attributes }) => {
        const { columns, gap, layout } = attributes;
        
        const blockProps = useBlockProps.save({
            className: `tmb-members tmb-layout-${layout}`,
            style: { 
                gap: `${gap}px`,
                gridTemplateColumns: layout === 'grid' ? `repeat(${columns}, 1fr)` : 'none'
            }
        });

        return (
            <div {...blockProps}>
                <InnerBlocks.Content />
            </div>
        );
    },
});