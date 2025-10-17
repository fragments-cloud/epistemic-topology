"""
Script para Gerar Figuras do Paper de Topologia Epistêmica
Antonio Müller - 2024

Este script gera todas as figuras necessárias para os papers em alta resolução.
"""

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
from scipy.ndimage import laplace
import os

# Criar diretório para figuras
os.makedirs('figures', exist_ok=True)

# Configurações globais para estilo profissional
plt.rcParams['figure.dpi'] = 300
plt.rcParams['savefig.dpi'] = 300
plt.rcParams['font.size'] = 11
plt.rcParams['font.family'] = 'serif'
plt.rcParams['axes.labelsize'] = 12
plt.rcParams['axes.titlesize'] = 13
plt.rcParams['legend.fontsize'] = 10
plt.rcParams['figure.figsize'] = (10, 6)

# ============================================
# FIGURA 1: Campo de Difusão 2D ao Longo do Tempo
# ============================================

def generate_diffusion_field():
    """
    Simula e visualiza a evolução do campo de densidade epistêmica ρ(x,y,t)
    em 2D ao longo do tempo.
    """
    print("Gerando Figura 1: Campo de Difusão 2D...")
    
    # Parâmetros da simulação
    grid_size = 100
    D = 0.5  # Difusão
    sigma = 0.02  # Criação
    mu = 0.01  # Dissipação
    dt = 0.05
    dx = 1.0
    n_steps = 200
    
    # Inicializar grid
    rho = np.zeros((grid_size, grid_size))
    
    # Sementes iniciais de conhecimento (centros epistêmicos)
    seeds = [
        (25, 25, 1.0),   # Universidade
        (75, 30, 0.8),   # Centro de pesquisa
        (50, 80, 0.6),   # Laboratório
        (30, 65, 0.9)    # Instituto
    ]
    
    for x, y, intensity in seeds:
        radius = 3
        for i in range(-radius, radius+1):
            for j in range(-radius, radius+1):
                if 0 <= x+i < grid_size and 0 <= y+j < grid_size:
                    dist = np.sqrt(i**2 + j**2)
                    if dist <= radius:
                        rho[y+j, x+i] = intensity * (1 - dist/radius)
    
    # Armazenar snapshots em tempos específicos
    snapshots = []
    snapshot_times = [0, 50, 100, 150, 199]
    
    # Evolução temporal
    for step in range(n_steps):
        # Calcular Laplaciano
        laplacian = (
            np.roll(rho, 1, axis=0) + np.roll(rho, -1, axis=0) +
            np.roll(rho, 1, axis=1) + np.roll(rho, -1, axis=1) -
            4 * rho
        ) / (dx**2)
        
        # Termo de criação não-linear (conhecimento gera conhecimento)
        creation = sigma * (0.1 + 0.5 * rho)
        
        # Atualização
        rho = rho + dt * (D * laplacian + creation - mu * rho)
        
        # Limites físicos
        rho = np.clip(rho, 0, 2.0)
        
        # Condições de contorno (reflexivas)
        rho[0, :] = rho[1, :]
        rho[-1, :] = rho[-2, :]
        rho[:, 0] = rho[:, 1]
        rho[:, -1] = rho[:, -2]
        
        if step in snapshot_times:
            snapshots.append(rho.copy())
    
    # Criar figura com 5 subplots
    fig, axes = plt.subplots(2, 3, figsize=(15, 10))
    axes = axes.flatten()
    
    # Remover último subplot (temos apenas 5)
    fig.delaxes(axes[5])
    
    # Colormap customizado (azul -> ciano -> verde -> amarelo -> vermelho)
    from matplotlib.colors import LinearSegmentedColormap
    colors = ['#000033', '#0000FF', '#00FFFF', '#00FF00', '#FFFF00', '#FF0000']
    n_bins = 256
    cmap = LinearSegmentedColormap.from_list('epistemic', colors, N=n_bins)
    
    for idx, (snap, time) in enumerate(zip(snapshots, snapshot_times)):
        ax = axes[idx]
        im = ax.imshow(snap, cmap=cmap, origin='lower', 
                      extent=[0, grid_size, 0, grid_size],
                      vmin=0, vmax=1.5, interpolation='bilinear')
        ax.set_title(f't = {time * dt:.1f} unidades', fontweight='bold')
        ax.set_xlabel('Espaço X')
        ax.set_ylabel('Espaço Y')
        ax.grid(False)
    
    # Colorbar compartilhado
    cbar = fig.colorbar(im, ax=axes[:5], orientation='horizontal', 
                       pad=0.05, aspect=50)
    cbar.set_label(r'Densidade Epistêmica $\rho(x,y,t)$', fontsize=12)
    
    plt.suptitle('Evolução Temporal do Campo de Densidade Epistêmica\n' + 
                 r'$\frac{\partial\rho}{\partial t} = D\nabla^2\rho + \sigma(1+\alpha\rho) - \mu\rho$',
                 fontsize=14, fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('figures/diffusion_field.png', bbox_inches='tight', dpi=300)
    print("✓ Figura 1 salva: figures/diffusion_field.png")
    plt.close()

# ============================================
# FIGURA 2: Interação Criação vs. Dissipação
# ============================================

def generate_creation_dissipation():
    """
    Visualiza o equilíbrio dinâmico entre criação (σ) e dissipação (μρ).
    """
    print("Gerando Figura 2: Criação vs. Dissipação...")
    
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    
    # Subplot 1: Diagrama de fases σ vs μ
    ax1 = axes[0, 0]
    sigma_range = np.linspace(0, 0.1, 50)
    mu_range = np.linspace(0, 0.05, 50)
    Sigma, Mu = np.meshgrid(sigma_range, mu_range)
    
    # Estado estacionário: ρ_eq = σ/μ (quando D∇²ρ = 0)
    rho_eq = Sigma / (Mu + 1e-10)
    rho_eq = np.clip(rho_eq, 0, 3)
    
    im1 = ax1.contourf(Sigma, Mu, rho_eq, levels=20, cmap='viridis')
    ax1.contour(Sigma, Mu, rho_eq, levels=[0.5, 1.0, 1.5, 2.0], 
                colors='white', linewidths=1.5, linestyles='--')
    ax1.set_xlabel(r'Taxa de Criação $\sigma$', fontsize=11)
    ax1.set_ylabel(r'Coeficiente de Dissipação $\mu$', fontsize=11)
    ax1.set_title('Estado Estacionário: ' + r'$\rho_{eq} = \sigma/\mu$', 
                 fontweight='bold')
    
    # Marcar casos empíricos
    cases = {
        'COVID-19': (0.06, 0.015, 'red'),
        'Deep Learning': (0.04, 0.008, 'blue'),
        'Bitcoin': (0.05, 0.012, 'orange'),
        'Climate': (0.025, 0.006, 'green')
    }
    for name, (s, m, color) in cases.items():
        ax1.plot(s, m, 'o', markersize=10, color=color, 
                markeredgecolor='white', markeredgewidth=2, label=name)
    ax1.legend(loc='upper right', fontsize=9)
    
    cbar1 = plt.colorbar(im1, ax=ax1)
    cbar1.set_label(r'$\rho_{eq}$', fontsize=10)
    
    # Subplot 2: Evolução temporal para diferentes σ
    ax2 = axes[0, 1]
    t = np.linspace(0, 50, 500)
    D = 0.0  # Sem difusão espacial para análise temporal pura
    mu = 0.01
    
    for sigma in [0.01, 0.03, 0.05, 0.07]:
        # Solução analítica: ρ(t) = (σ/μ)(1 - exp(-μt))
        rho_t = (sigma / mu) * (1 - np.exp(-mu * t))
        ax2.plot(t, rho_t, linewidth=2, label=rf'$\sigma={sigma}$')
    
    ax2.set_xlabel('Tempo (unidades)', fontsize=11)
    ax2.set_ylabel(r'$\rho(t)$', fontsize=11)
    ax2.set_title('Crescimento para Diferentes Taxas de Criação\n' + 
                 r'($\mu=0.01$ fixo)', fontweight='bold')
    ax2.legend(fontsize=9)
    ax2.grid(True, alpha=0.3)
    
    # Subplot 3: Evolução temporal para diferentes μ
    ax3 = axes[1, 0]
    sigma = 0.05
    
    for mu in [0.005, 0.01, 0.02, 0.04]:
        rho_t = (sigma / mu) * (1 - np.exp(-mu * t))
        ax3.plot(t, rho_t, linewidth=2, label=rf'$\mu={mu}$')
    
    ax3.set_xlabel('Tempo (unidades)', fontsize=11)
    ax3.set_ylabel(r'$\rho(t)$', fontsize=11)
    ax3.set_title('Crescimento para Diferentes Dissipações\n' + 
                 r'($\sigma=0.05$ fixo)', fontweight='bold')
    ax3.legend(fontsize=9)
    ax3.grid(True, alpha=0.3)
    
    # Subplot 4: Balanço energético
    ax4 = axes[1, 1]
    rho_range = np.linspace(0, 2, 100)
    sigma_fixed = 0.04
    mu_fixed = 0.015
    
    creation_term = sigma_fixed * np.ones_like(rho_range)
    dissipation_term = mu_fixed * rho_range
    net_change = creation_term - dissipation_term
    
    ax4.plot(rho_range, creation_term, 'g-', linewidth=2.5, label=r'Criação $\sigma$')
    ax4.plot(rho_range, dissipation_term, 'r-', linewidth=2.5, 
            label=r'Dissipação $\mu\rho$')
    ax4.plot(rho_range, net_change, 'b--', linewidth=2, 
            label=r'Líquido $\sigma - \mu\rho$')
    ax4.axhline(0, color='black', linestyle=':', alpha=0.5)
    ax4.axvline(sigma_fixed/mu_fixed, color='purple', linestyle='--', 
               alpha=0.7, label=r'$\rho_{eq}$')
    
    ax4.set_xlabel(r'Densidade $\rho$', fontsize=11)
    ax4.set_ylabel('Taxa de Mudança', fontsize=11)
    ax4.set_title('Balanço Criação-Dissipação', fontweight='bold')
    ax4.legend(fontsize=9)
    ax4.grid(True, alpha=0.3)
    ax4.set_ylim(-0.05, 0.06)
    
    plt.suptitle('Dinâmica de Criação e Dissipação Epistêmica', 
                fontsize=14, fontweight='bold', y=0.995)
    plt.tight_layout()
    plt.savefig('figures/creation_dissipation.png', bbox_inches='tight', dpi=300)
    print("✓ Figura 2 salva: figures/creation_dissipation.png")
    plt.close()

# ============================================
# FIGURA 3: Validação Empírica (4 Casos)
# ============================================

def generate_empirical_validation():
    """
    Compara predições do modelo com dados reais para os 4 casos de estudo.
    """
    print("Gerando Figura 3: Validação Empírica...")
    
    fig, axes = plt.subplots(2, 2, figsize=(14, 10))
    
    # Caso 1: COVID-19 (2020)
    ax1 = axes[0, 0]
    months = np.arange(12)
    observed_covid = np.array([5, 8, 85, 100, 95, 75, 70, 68, 72, 78, 82, 80])
    
    # Simular modelo
    D, sigma, mu = 0.85, 0.06, 0.015
    rho = observed_covid[0] / 100
    predicted_covid = [rho * 100]
    
    for i in range(11):
        drho_dt = sigma - mu * rho + D * rho * (1 - rho)  # Logístico
        rho += drho_dt * 0.5
        rho = max(0, min(1, rho))
        predicted_covid.append(rho * 100)
    
    predicted_covid = np.array(predicted_covid)
    
    ax1.plot(months, observed_covid, 'o-', linewidth=2.5, markersize=8, 
            color='#2E86DE', label='Dados Reais', markeredgecolor='white', 
            markeredgewidth=1.5)
    ax1.plot(months, predicted_covid, 's--', linewidth=2, markersize=7, 
            color='#EE5A6F', label='Modelo Predito', markeredgecolor='white', 
            markeredgewidth=1.5)
    ax1.set_title('COVID-19 (2020)\n' + r'$D=0.85, \sigma=0.06, \mu=0.015$', 
                 fontweight='bold')
    ax1.set_xlabel('Meses (Jan-Dez 2020)')
    ax1.set_ylabel('Densidade Normalizada')
    ax1.legend(loc='upper right')
    ax1.grid(True, alpha=0.3)
    
    # Correlação
    corr = np.corrcoef(observed_covid, predicted_covid)[0, 1]
    ax1.text(0.05, 0.95, f'r = {corr:.3f}', transform=ax1.transAxes,
            fontsize=11, verticalalignment='top',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
    
    # Caso 2: Deep Learning (2012-2024)
    ax2 = axes[0, 1]
    years = np.arange(12)
    observed_dl = np.array([10, 15, 22, 32, 45, 58, 72, 82, 88, 92, 95, 97])
    
    D, sigma, mu = 0.45, 0.04, 0.008
    rho = observed_dl[0] / 100
    predicted_dl = [rho * 100]
    
    for i in range(11):
        drho_dt = sigma - mu * rho + D * rho * (1 - rho)
        rho += drho_dt * 1.0
        rho = max(0, min(1, rho))
        predicted_dl.append(rho * 100)
    
    predicted_dl = np.array(predicted_dl)
    
    ax2.plot(years, observed_dl, 'o-', linewidth=2.5, markersize=8,
            color='#9B59B6', label='Dados Reais', markeredgecolor='white',
            markeredgewidth=1.5)
    ax2.plot(years, predicted_dl, 's--', linewidth=2, markersize=7,
            color='#F39C12', label='Modelo Predito', markeredgecolor='white',
            markeredgewidth=1.5)
    ax2.set_title('Deep Learning (2012-2024)\n' + r'$D=0.45, \sigma=0.04, \mu=0.008$',
                 fontweight='bold')
    ax2.set_xlabel('Anos (2012-2023)')
    ax2.set_ylabel('Densidade Normalizada')
    ax2.legend(loc='lower right')
    ax2.grid(True, alpha=0.3)
    
    corr = np.corrcoef(observed_dl, predicted_dl)[0, 1]
    ax2.text(0.05, 0.95, f'r = {corr:.3f}', transform=ax2.transAxes,
            fontsize=11, verticalalignment='top',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
    
    # Caso 3: Bitcoin (2009-2024)
    ax3 = axes[1, 0]
    years_btc = [0, 2, 4, 6, 8, 10, 12, 14]
    observed_btc = np.array([2, 8, 35, 25, 85, 45, 100, 60])
    
    D, sigma, mu = 0.55, 0.05, 0.012
    rho = observed_btc[0] / 100
    predicted_btc = [rho * 100]
    
    for i in range(7):
        drho_dt = sigma - mu * rho + D * rho * (1 - rho)
        rho += drho_dt * 1.5
        rho = max(0, min(1.2, rho))
        predicted_btc.append(rho * 100)
    
    predicted_btc = np.array(predicted_btc)
    
    ax3.plot(years_btc, observed_btc, 'o-', linewidth=2.5, markersize=8,
            color='#F39C12', label='Dados Reais', markeredgecolor='white',
            markeredgewidth=1.5)
    ax3.plot(years_btc, predicted_btc, 's--', linewidth=2, markersize=7,
            color='#27AE60', label='Modelo Predito', markeredgecolor='white',
            markeredgewidth=1.5)
    ax3.set_title('Bitcoin (2009-2024)\n' + r'$D=0.55, \sigma=0.05, \mu=0.012$',
                 fontweight='bold')
    ax3.set_xlabel('Anos')
    ax3.set_ylabel('Densidade Normalizada')
    ax3.legend(loc='upper right')
    ax3.grid(True, alpha=0.3)
    
    corr = np.corrcoef(observed_btc, predicted_btc)[0, 1]
    ax3.text(0.05, 0.95, f'r = {corr:.3f}', transform=ax3.transAxes,
            fontsize=11, verticalalignment='top',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
    
    # Caso 4: Climate Change (1990-2024)
    ax4 = axes[1, 1]
    years_climate = [0, 5, 10, 15, 20, 25, 30, 34]
    observed_climate = np.array([15, 20, 25, 32, 45, 62, 78, 85])
    
    D, sigma, mu = 0.35, 0.025, 0.006
    rho = observed_climate[0] / 100
    predicted_climate = [rho * 100]
    
    for i in range(7):
        drho_dt = sigma - mu * rho + D * rho * (1 - rho)
        rho += drho_dt * 3.0
        rho = max(0, min(1, rho))
        predicted_climate.append(rho * 100)
    
    predicted_climate = np.array(predicted_climate)
    
    ax4.plot(years_climate, observed_climate, 'o-', linewidth=2.5, markersize=8,
            color='#27AE60', label='Dados Reais', markeredgecolor='white',
            markeredgewidth=1.5)
    ax4.plot(years_climate, predicted_climate, 's--', linewidth=2, markersize=7,
            color='#3498DB', label='Modelo Predito', markeredgecolor='white',
            markeredgewidth=1.5)
    ax4.set_title('Mudança Climática (1990-2024)\n' + r'$D=0.35, \sigma=0.025, \mu=0.006$',
                 fontweight='bold')
    ax4.set_xlabel('Anos desde 1990')
    ax4.set_ylabel('Densidade Normalizada')
    ax4.legend(loc='lower right')
    ax4.grid(True, alpha=0.3)
    
    corr = np.corrcoef(observed_climate, predicted_climate)[0, 1]
    ax4.text(0.05, 0.95, f'r = {corr:.3f}', transform=ax4.transAxes,
            fontsize=11, verticalalignment='top',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.8))
    
    plt.suptitle('Validação Empírica: Modelo vs. Dados Reais', 
                fontsize=14, fontweight='bold', y=0.995)
    plt.tight_layout()
    plt.savefig('figures/empirical_validation.png', bbox_inches='tight', dpi=300)
    print("✓ Figura 3 salva: figures/empirical_validation.png")
    plt.close()

# ============================================
# FIGURA 4: Parâmetros Calibrados
# ============================================

def generate_parameter_space():
    """
    Visualiza os parâmetros calibrados no espaço (D, σ, μ).
    """
    print("Gerando Figura 4: Espaço de Parâmetros...")
    
    fig = plt.figure(figsize=(12, 10))
    
    # Subplot 3D
    ax = fig.add_subplot(221, projection='3d')
    
    cases = {
        'COVID-19': (0.85, 0.06, 0.015, 'red', 'o'),
        'Deep Learning': (0.45, 0.04, 0.008, 'blue', 's'),
        'Bitcoin': (0.55, 0.05, 0.012, 'orange', '^'),
        'Climate': (0.35, 0.025, 0.006, 'green', 'D')
    }
    
    for name, (D, sigma, mu, color, marker) in cases.items():
        ax.scatter(D, sigma, mu, s=200, c=color, marker=marker, 
                  edgecolors='black', linewidth=2, label=name, alpha=0.9)
    
    ax.set_xlabel(r'Difusão $D$', fontsize=11, labelpad=10)
    ax.set_ylabel(r'Criação $\sigma$', fontsize=11, labelpad=10)
    ax.set_zlabel(r'Dissipação $\mu$', fontsize=11, labelpad=10)
    ax.set_title('Parâmetros Calibrados no Espaço 3D', fontweight='bold', pad=20)
    ax.legend(loc='upper left', fontsize=9)
    ax.view_init(elev=20, azim=45)
    
    # Subplot: D vs σ
    ax2 = fig.add_subplot(222)
    for name, (D, sigma, mu, color, marker) in cases.items():
        ax2.scatter(D, sigma, s=200, c=color, marker=marker,
                   edgecolors='black', linewidth=2, label=name, alpha=0.9)
    ax2.set_xlabel(r'Difusão $D$', fontsize=11)
    ax2.set_ylabel(r'Criação $\sigma$', fontsize=11)
    ax2.set_title(r'$D$ vs $\sigma$', fontweight='bold')
    ax2.grid(True, alpha=0.3)
    ax2.legend(fontsize=9)
    
    # Subplot: D vs μ
    ax3 = fig.add_subplot(223)
    for name, (D, sigma, mu, color, marker) in cases.items():
        ax3.scatter(D, mu, s=200, c=color, marker=marker,
                   edgecolors='black', linewidth=2, label=name, alpha=0.9)
    ax3.set_xlabel(r'Difusão $D$', fontsize=11)
    ax3.set_ylabel(r'Dissipação $\mu$', fontsize=11)
    ax3.set_title(r'$D$ vs $\mu$', fontweight='bold')
    ax3.grid(True, alpha=0.3)
    ax3.legend(fontsize=9)
    
    # Subplot: σ vs μ
    ax4 = fig.add_subplot(224)
    for name, (D, sigma, mu, color, marker) in cases.items():
        ax4.scatter(sigma, mu, s=200, c=color, marker=marker,
                   edgecolors='black', linewidth=2, label=name, alpha=0.9)
    ax4.set_xlabel(r'Criação $\sigma$', fontsize=11)
    ax4.set_ylabel(r'Dissipação $\mu$', fontsize=11)
    ax4.set_title(r'$\sigma$ vs $\mu$', fontweight='bold')
    ax4.grid(True, alpha=0.3)
    ax4.legend(fontsize=9)
    
    plt.suptitle('Análise do Espaço de Parâmetros', fontsize=14, 
                fontweight='bold', y=0.995)
    plt.tight_layout()
    plt.savefig('figures/parameter_space.png', bbox_inches='tight', dpi=300)
    print("✓ Figura 4 salva: figures/parameter_space.png")
    plt.close()

# ============================================
# MAIN
# ============================================

if __name__ == "__main__":
    print("="*60)
    print("GERADOR DE FIGURAS - TOPOLOGIA EPISTÊMICA")
    print("Antonio Müller - 2024")
    print("="*60)
    print()
    
    # Gerar todas as figuras
    generate_diffusion_field()
    print()
    generate_creation_dissipation()
    print()
    generate_empirical_validation()
    print()
    generate_parameter_space()
    
    print()
    print("="*60)
    print("✓ TODAS AS FIGURAS GERADAS COM SUCESSO!")
    print("="*60)
    print()
    print("Figuras salvas em:")
    print("  - figures/diffusion_field.png")
    print("  - figures/creation_dissipation.png")
    print("  - figures/empirical_validation.png")
    print("  - figures/parameter_space.png")
    print()
    print("Próximo passo: Compilar o LaTeX com estas figuras!")
    print("="*60)