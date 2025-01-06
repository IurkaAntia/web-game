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

echo collect(app(\Illuminate\View\Compilers\BladeCompiler::class)->getCustomDirectives())
    ->map(function ($customDirective, $name) {
        if ($customDirective instanceof \Closure) {
            return [
                'name' => $name,
                'hasParams' => (new ReflectionFunction($customDirective))->getNumberOfParameters() >= 1,
            ];
        }

        if (is_array($customDirective)) {
            return [
                'name' => $name,
                'hasParams' => (new ReflectionMethod($customDirective[0], $customDirective[1]))->getNumberOfParameters() >= 1,
            ];
        }

        return null;
    })
    ->filter()
    ->values()
    ->toJson();
;
echo '__VSCODE_LARAVEL_END_OUTPUT__';

exit(0);
