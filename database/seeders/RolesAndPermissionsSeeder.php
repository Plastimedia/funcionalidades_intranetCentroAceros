<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles
        $roleEmpleado = Role::create(['name' => 'empleado']);
        $roleRRHH = Role::create(['name' => 'rrhh']);
        $roleTecnologia = Role::create(['name' => 'tecnologia']);

        // Create an admin user for testing
        $admin = User::firstOrCreate(
            ['email' => 'jeduardeveloper@gmail.com'],
            [
                'name' => 'jose',
                'password' => Hash::make('12345678'),
                'must_change_password' => false,
                'is_active' => true,
            ]
        );
        $admin->assignRole($roleRRHH);

        // Create second admin user
        $admin2 = User::firstOrCreate(
            ['email' => 'desarrollo@plastimedia.com'],
            [
                'name' => 'momi',
                'password' => Hash::make('12345678'),
                'must_change_password' => false,
                'is_active' => true,
            ]
        );
        $admin2->assignRole($roleRRHH);
    }
}
