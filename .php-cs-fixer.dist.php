<?php
/**
 *  Copyright © iMi digital GmbH, based on work by MageSpecialist
 *  See LICENSE for license details.
 */

$header = <<<'EOF'
 Copyright © iMi digital GmbH, based on work by MageSpecialist
 See LICENSE for license details.
EOF;

$finder = PhpCsFixer\Finder::create()
    ->in(__DIR__)
    ->exclude([
        'vendor',
        'view',
        'i18n',
    ])
    ->name('*.php')
    ->name('registration.php')
    ->ignoreDotFiles(true)
    ->ignoreVCS(true);

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@PSR12'                                 => true,
        '@PSR12:risky'                           => true,
        'array_syntax'                           => ['syntax' => 'short'],
        'header_comment'                         => [
            'header'       => $header,
            'comment_type' => 'PHPDoc',
            'location'     => 'after_open',
            'separate'     => 'bottom',
        ],
        'binary_operator_spaces'                 => ['default' => 'single_space'],
        'blank_line_after_opening_tag'           => false,
        'blank_line_before_statement'            => ['statements' => ['return', 'throw', 'try']],
        'cast_spaces'                            => ['space' => 'single'],
        'concat_space'                           => ['spacing' => 'one'],
        'global_namespace_import'                => [
            'import_classes'   => true,
            'import_constants' => false,
            'import_functions' => false,
        ],
        'no_unused_imports'                      => true,
        'no_useless_else'                        => true,
        'no_useless_return'                      => true,
        'ordered_imports'                        => ['sort_algorithm' => 'alpha'],
        'phpdoc_align'                           => ['align' => 'left'],
        'phpdoc_order'                           => true,
        'phpdoc_separation'                      => true,
        'phpdoc_trim'                            => true,
        'single_quote'                           => true,
        'trailing_comma_in_multiline'            => ['elements' => ['arrays']],
        'trim_array_spaces'                      => true,
        'whitespace_after_comma_in_array'        => true,
    ])
    ->setFinder($finder)
    ->setCacheFile(__DIR__ . '/.php-cs-fixer.cache');