<?php


error_reporting(E_ERROR | E_PARSE);

define('LARAVEL_START', microtime(true));

require_once __DIR__ . '/../autoload.php';
$app = require_once __DIR__ . '/../../bootstrap/app.php';

class VsCodeLaravel extends \Illuminate\Support\ServiceProvider
{
    public function register()
    {
    }

    public function boot()
    {
        if (method_exists($this->app['log'], 'setHandlers')) {
            $this->app['log']->setHandlers([new \Monolog\Handler\ProcessHandler()]);
        }
    }
}

$app->register(new VsCodeLaravel($app));
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo '__VSCODE_LARAVEL_START_OUTPUT__';

echo collect(app()->getBindings())
    ->filter(fn ($binding) => ($binding['concrete'] ?? null) !== null)
    ->flatMap(function ($binding, $key) {
        $boundTo = new ReflectionFunction($binding['concrete']);

        $closureClass = $boundTo->getClosureScopeClass();

        return [
            $key => [
                'uri' => $closureClass->getFileName(),
                'class' => $closureClass->getName(),
                'startLine' => $boundTo->getStartLine(),
            ],
        ];
    })->toJson();
;
echo '__VSCODE_LARAVEL_END_OUTPUT__';

exit(0);
